const db = require('../config/database');

/**
 * Get user's notifications
 * GET /api/v1/apps/:appId/notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 20;
    const unread_only = req.query.unread_only === 'true';
    const limit = per_page;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE app_id = ? AND user_id = ?';
    const params = [appId, userId];

    if (unread_only) {
      whereClause += ' AND is_read = 0';
    }

    // Get notifications
    const notificationsResult = await db.query(
      `SELECT * FROM notifications 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const notifications = Array.isArray(notificationsResult) && Array.isArray(notificationsResult[0])
      ? notificationsResult[0]
      : notificationsResult;

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM notifications ${whereClause}`,
      params
    );

    const countData = Array.isArray(countResult) && Array.isArray(countResult[0])
      ? countResult[0]
      : countResult;
    const total = countData[0]?.total || 0;

    // Get unread count
    const unreadResult = await db.query(
      `SELECT COUNT(*) as unread FROM notifications 
       WHERE app_id = ? AND user_id = ? AND is_read = 0`,
      [appId, userId]
    );

    const unreadData = Array.isArray(unreadResult) && Array.isArray(unreadResult[0])
      ? unreadResult[0]
      : unreadResult;
    const unread_count = unreadData[0]?.unread || 0;

    // Parse JSON data field
    const parsedNotifications = (notifications || []).map(n => ({
      ...n,
      data: typeof n.data === 'string' ? JSON.parse(n.data) : n.data
    }));

    res.json({
      success: true,
      data: {
        notifications: parsedNotifications,
        unread_count,
        pagination: {
          page,
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

/**
 * Get unread notification count
 * GET /api/v1/apps/:appId/notifications/unread-count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE app_id = ? AND user_id = ? AND is_read = 0`,
      [appId, userId]
    );

    const data = Array.isArray(result) && Array.isArray(result[0])
      ? result[0]
      : result;

    res.json({
      success: true,
      data: {
        unread_count: data[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 * PUT /api/v1/apps/:appId/notifications/:notificationId/read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { appId, notificationId } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const checkResult = await db.query(
      `SELECT id FROM notifications WHERE id = ? AND app_id = ? AND user_id = ?`,
      [notificationId, appId, userId]
    );

    const checkData = Array.isArray(checkResult) && Array.isArray(checkResult[0])
      ? checkResult[0]
      : checkResult;

    if (!checkData || checkData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await db.query(
      `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?`,
      [notificationId]
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 * PUT /api/v1/apps/:appId/notifications/read-all
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `UPDATE notifications SET is_read = 1, read_at = NOW() 
       WHERE app_id = ? AND user_id = ? AND is_read = 0`,
      [appId, userId]
    );

    const affectedRows = result.affectedRows || 0;

    res.json({
      success: true,
      message: `Marked ${affectedRows} notification(s) as read`,
      data: {
        marked_count: affectedRows
      }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

/**
 * Delete a notification
 * DELETE /api/v1/apps/:appId/notifications/:notificationId
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { appId, notificationId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `DELETE FROM notifications WHERE id = ? AND app_id = ? AND user_id = ?`,
      [notificationId, appId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

/**
 * Create a notification (internal use / helper function)
 * Can be called from other controllers
 */
exports.createNotification = async (appId, userId, type, title, message, data = null) => {
  try {
    const result = await db.query(
      `INSERT INTO notifications (app_id, user_id, type, title, message, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [appId, userId, type, title, message, data ? JSON.stringify(data) : null]
    );

    console.log(`[Notification] Created for user ${userId}: ${type} - ${title}`);
    return result.insertId;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create notifications for multiple users (internal use)
 */
exports.createNotificationBulk = async (appId, userIds, type, title, message, data = null) => {
  try {
    const dataJson = data ? JSON.stringify(data) : null;
    const values = userIds.map(userId => [appId, userId, type, title, message, dataJson]);
    
    await db.query(
      `INSERT INTO notifications (app_id, user_id, type, title, message, data)
       VALUES ?`,
      [values]
    );

    console.log(`[Notification] Created bulk for ${userIds.length} users: ${type} - ${title}`);
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};
