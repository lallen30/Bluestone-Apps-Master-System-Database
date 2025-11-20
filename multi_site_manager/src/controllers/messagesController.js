const db = require('../config/database');

/**
 * Start or get existing conversation
 * POST /api/v1/apps/:appId/conversations
 */
exports.startConversation = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { other_user_id, listing_id, initial_message } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!other_user_id) {
      return res.status(400).json({
        success: false,
        message: 'other_user_id is required'
      });
    }

    // Check if conversation already exists
    const existingResult = await db.query(
      `SELECT id FROM conversations 
       WHERE app_id = ? 
         AND listing_id <=> ?
         AND ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?))`,
      [appId, listing_id || null, userId, other_user_id, other_user_id, userId]
    );

    const existing = Array.isArray(existingResult) && Array.isArray(existingResult[0]) 
      ? existingResult[0] 
      : existingResult;

    let conversationId;

    if (existing && existing.length > 0) {
      conversationId = existing[0].id;
    } else {
      // Create new conversation
      const result = await db.query(
        `INSERT INTO conversations (app_id, listing_id, user1_id, user2_id)
         VALUES (?, ?, ?, ?)`,
        [appId, listing_id || null, userId, other_user_id]
      );
      conversationId = result.insertId;
    }

    // Send initial message if provided
    if (initial_message) {
      await db.query(
        `INSERT INTO messages (conversation_id, sender_id, message_text)
         VALUES (?, ?, ?)`,
        [conversationId, userId, initial_message]
      );
    }

    res.status(201).json({
      success: true,
      data: {
        conversation_id: conversationId,
        message: initial_message ? 'Conversation started and message sent' : 'Conversation started'
      }
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting conversation',
      error: error.message
    });
  }
};

/**
 * Get user's conversations
 * GET /api/v1/apps/:appId/conversations
 */
exports.getConversations = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { page = 1, per_page = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;

    const conversationsResult = await db.query(
      `SELECT 
        c.id,
        c.listing_id,
        c.last_message_at,
        c.last_message_preview,
        c.created_at,
        l.title as listing_title,
        l.city as listing_city,
        CASE 
          WHEN c.user1_id = ? THEN u2.id
          ELSE u1.id
        END as other_user_id,
        CASE 
          WHEN c.user1_id = ? THEN u2.first_name
          ELSE u1.first_name
        END as other_user_first_name,
        CASE 
          WHEN c.user1_id = ? THEN u2.last_name
          ELSE u1.last_name
        END as other_user_last_name,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
           AND m.sender_id != ? 
           AND m.is_read = 0) as unread_count
       FROM conversations c
       LEFT JOIN property_listings l ON c.listing_id = l.id
       LEFT JOIN app_users u1 ON c.user1_id = u1.id
       LEFT JOIN app_users u2 ON c.user2_id = u2.id
       WHERE c.app_id = ? 
         AND (c.user1_id = ? OR c.user2_id = ?)
         AND (
           (c.user1_id = ? AND c.is_archived_user1 = 0) OR
           (c.user2_id = ? AND c.is_archived_user2 = 0)
         )
       ORDER BY c.last_message_at DESC
       LIMIT ? OFFSET ?`,
      [userId, userId, userId, userId, appId, userId, userId, userId, userId, limit, offset]
    );

    const conversations = Array.isArray(conversationsResult) && Array.isArray(conversationsResult[0]) 
      ? conversationsResult[0] 
      : conversationsResult;

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total 
       FROM conversations 
       WHERE app_id = ? AND (user1_id = ? OR user2_id = ?)`,
      [appId, userId, userId]
    );

    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        conversations: conversations || [],
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

/**
 * Get messages in a conversation
 * GET /api/v1/apps/:appId/conversations/:conversationId/messages
 */
exports.getMessages = async (req, res) => {
  try {
    const { appId, conversationId } = req.params;
    const userId = req.user?.id;
    const { page = 1, per_page = 50 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify user is part of conversation
    const conversationResult = await db.query(
      `SELECT id FROM conversations 
       WHERE id = ? AND app_id = ? AND (user1_id = ? OR user2_id = ?)`,
      [conversationId, appId, userId, userId]
    );

    const conversation = Array.isArray(conversationResult) && Array.isArray(conversationResult[0]) 
      ? conversationResult[0] 
      : conversationResult;

    if (!conversation || conversation.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this conversation'
      });
    }

    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;

    const messagesResult = await db.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.message_text,
        m.attachment_url,
        m.attachment_type,
        m.is_read,
        m.read_at,
        m.created_at,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
       FROM messages m
       JOIN app_users u ON m.sender_id = u.id
       WHERE m.conversation_id = ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [conversationId, limit, offset]
    );

    const messages = Array.isArray(messagesResult) && Array.isArray(messagesResult[0]) 
      ? messagesResult[0] 
      : messagesResult;

    // Mark messages as read
    await db.query(
      `UPDATE messages 
       SET is_read = 1, read_at = NOW() 
       WHERE conversation_id = ? AND sender_id != ? AND is_read = 0`,
      [conversationId, userId]
    );

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM messages WHERE conversation_id = ?`,
      [conversationId]
    );

    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        messages: (messages || []).reverse(), // Reverse to show oldest first
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

/**
 * Send a message
 * POST /api/v1/apps/:appId/conversations/:conversationId/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { appId, conversationId } = req.params;
    const userId = req.user?.id;
    const { message_text, attachment_url, attachment_type } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!message_text || message_text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    // Verify user is part of conversation
    const conversationResult = await db.query(
      `SELECT id FROM conversations 
       WHERE id = ? AND app_id = ? AND (user1_id = ? OR user2_id = ?)`,
      [conversationId, appId, userId, userId]
    );

    const conversation = Array.isArray(conversationResult) && Array.isArray(conversationResult[0]) 
      ? conversationResult[0] 
      : conversationResult;

    if (!conversation || conversation.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this conversation'
      });
    }

    // Insert message
    const result = await db.query(
      `INSERT INTO messages (conversation_id, sender_id, message_text, attachment_url, attachment_type)
       VALUES (?, ?, ?, ?, ?)`,
      [conversationId, userId, message_text.trim(), attachment_url || null, attachment_type || null]
    );

    const messageId = result.insertId;

    // Get the created message
    const messageResult = await db.query(
      `SELECT 
        m.*,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
       FROM messages m
       JOIN app_users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [messageId]
    );

    const message = messageResult[0];

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: { message }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * Mark messages as read
 * PUT /api/v1/apps/:appId/conversations/:conversationId/read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { appId, conversationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify user is part of conversation
    const conversationResult = await db.query(
      `SELECT id FROM conversations 
       WHERE id = ? AND app_id = ? AND (user1_id = ? OR user2_id = ?)`,
      [conversationId, appId, userId, userId]
    );

    const conversation = Array.isArray(conversationResult) && Array.isArray(conversationResult[0]) 
      ? conversationResult[0] 
      : conversationResult;

    if (!conversation || conversation.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this conversation'
      });
    }

    // Mark all messages from other user as read
    await db.query(
      `UPDATE messages 
       SET is_read = 1, read_at = NOW() 
       WHERE conversation_id = ? AND sender_id != ? AND is_read = 0`,
      [conversationId, userId]
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

/**
 * Delete/Archive conversation
 * DELETE /api/v1/apps/:appId/conversations/:conversationId
 */
exports.archiveConversation = async (req, res) => {
  try {
    const { appId, conversationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get conversation to determine which user field to update
    const conversationResult = await db.query(
      `SELECT user1_id, user2_id FROM conversations 
       WHERE id = ? AND app_id = ? AND (user1_id = ? OR user2_id = ?)`,
      [conversationId, appId, userId, userId]
    );

    const conversation = Array.isArray(conversationResult) && Array.isArray(conversationResult[0]) 
      ? conversationResult[0] 
      : conversationResult;

    if (!conversation || conversation.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this conversation'
      });
    }

    const conv = conversation[0];
    const archiveField = conv.user1_id === userId ? 'is_archived_user1' : 'is_archived_user2';

    await db.query(
      `UPDATE conversations SET ${archiveField} = 1 WHERE id = ?`,
      [conversationId]
    );

    res.json({
      success: true,
      message: 'Conversation archived'
    });
  } catch (error) {
    console.error('Error archiving conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving conversation',
      error: error.message
    });
  }
};
