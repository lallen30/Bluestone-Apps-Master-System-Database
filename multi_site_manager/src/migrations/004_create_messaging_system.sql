-- Migration: Create Messaging System Tables
-- Date: 2025-11-20
-- Description: Tables for guest-host messaging

-- ============================================
-- Conversations Table
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  listing_id INT NULL, -- Optional: Link to property listing
  user1_id INT NOT NULL, -- First participant
  user2_id INT NOT NULL, -- Second participant
  
  -- Metadata
  last_message_at TIMESTAMP NULL,
  last_message_preview TEXT,
  
  -- Status
  is_archived_user1 TINYINT(1) DEFAULT 0,
  is_archived_user2 TINYINT(1) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign keys
  FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE SET NULL,
  FOREIGN KEY (user1_id) REFERENCES app_users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES app_users(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_app_id (app_id),
  INDEX idx_listing_id (listing_id),
  INDEX idx_user1_id (user1_id),
  INDEX idx_user2_id (user2_id),
  INDEX idx_last_message_at (last_message_at),
  
  -- Ensure unique conversation between two users for a listing
  UNIQUE KEY unique_conversation (listing_id, user1_id, user2_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  
  -- Message content
  message_text TEXT NOT NULL,
  
  -- Attachments (optional - for future use)
  attachment_url VARCHAR(500) NULL,
  attachment_type VARCHAR(50) NULL,
  
  -- Read status
  is_read TINYINT(1) DEFAULT 0,
  read_at TIMESTAMP NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign keys
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES app_users(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_created_at (created_at),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Message Read Receipts (Optional - for group chats in future)
-- ============================================
CREATE TABLE IF NOT EXISTS message_read_receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT NOT NULL,
  user_id INT NOT NULL,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_receipt (message_id, user_id),
  INDEX idx_message_id (message_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Triggers to update conversation metadata
-- ============================================
DELIMITER //

CREATE TRIGGER after_message_insert
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
  UPDATE conversations 
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.message_text, 100),
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
END//

DELIMITER ;

-- ============================================
-- Sample data for testing (optional)
-- ============================================
-- Uncomment to add test conversations
/*
-- Create a conversation between user 21 (guest) and user 22 (host) about listing 1
INSERT INTO conversations (app_id, listing_id, user1_id, user2_id)
VALUES (28, 1, 21, 22);

-- Add some test messages
INSERT INTO messages (conversation_id, sender_id, message_text)
VALUES 
  (1, 21, 'Hi! Is this property available for December 1-5?'),
  (1, 22, 'Yes, it is available! Would you like to book it?'),
  (1, 21, 'Great! I have a few questions about parking...');
*/
