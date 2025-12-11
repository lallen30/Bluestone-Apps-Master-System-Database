const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

/**
 * GET /api/v1/apps/:appId/notifications
 * Get user's notifications
 */
router.get(
  '/apps/:appId/notifications',
  authenticateMobileUser({ required: true }),
  notificationsController.getNotifications
);

/**
 * GET /api/v1/apps/:appId/notifications/unread-count
 * Get unread notification count
 */
router.get(
  '/apps/:appId/notifications/unread-count',
  authenticateMobileUser({ required: true }),
  notificationsController.getUnreadCount
);

/**
 * PUT /api/v1/apps/:appId/notifications/read-all
 * Mark all notifications as read
 */
router.put(
  '/apps/:appId/notifications/read-all',
  authenticateMobileUser({ required: true }),
  notificationsController.markAllAsRead
);

/**
 * PUT /api/v1/apps/:appId/notifications/:notificationId/read
 * Mark single notification as read
 */
router.put(
  '/apps/:appId/notifications/:notificationId/read',
  authenticateMobileUser({ required: true }),
  notificationsController.markAsRead
);

/**
 * DELETE /api/v1/apps/:appId/notifications/:notificationId
 * Delete a notification
 */
router.delete(
  '/apps/:appId/notifications/:notificationId',
  authenticateMobileUser({ required: true }),
  notificationsController.deleteNotification
);

module.exports = router;
