const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// All routes require authentication

/**
 * POST /api/v1/apps/:appId/conversations
 * Start or get existing conversation
 */
router.post(
  '/apps/:appId/conversations',
  authenticateMobileUser({ required: true }),
  messagesController.startConversation
);

/**
 * GET /api/v1/apps/:appId/conversations
 * Get user's conversations
 */
router.get(
  '/apps/:appId/conversations',
  authenticateMobileUser({ required: true }),
  messagesController.getConversations
);

/**
 * GET /api/v1/apps/:appId/conversations/:conversationId/messages
 * Get messages in a conversation
 */
router.get(
  '/apps/:appId/conversations/:conversationId/messages',
  authenticateMobileUser({ required: true }),
  messagesController.getMessages
);

/**
 * POST /api/v1/apps/:appId/conversations/:conversationId/messages
 * Send a message
 */
router.post(
  '/apps/:appId/conversations/:conversationId/messages',
  authenticateMobileUser({ required: true }),
  messagesController.sendMessage
);

/**
 * PUT /api/v1/apps/:appId/conversations/:conversationId/read
 * Mark messages as read
 */
router.put(
  '/apps/:appId/conversations/:conversationId/read',
  authenticateMobileUser({ required: true }),
  messagesController.markAsRead
);

/**
 * DELETE /api/v1/apps/:appId/conversations/:conversationId
 * Archive conversation
 */
router.delete(
  '/apps/:appId/conversations/:conversationId',
  authenticateMobileUser({ required: true }),
  messagesController.archiveConversation
);

module.exports = router;
