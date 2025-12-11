-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL COMMENT 'booking_request, booking_confirmed, booking_cancelled, new_message, review_received, etc.',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSON COMMENT 'Additional data like booking_id, conversation_id, listing_id, etc.',
  is_read TINYINT(1) DEFAULT 0,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_app_user (app_id, user_id),
  INDEX idx_notifications_unread (app_id, user_id, is_read),
  INDEX idx_notifications_type (type),
  
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- Add notification_list element type
INSERT INTO screen_elements (name, element_type, category, icon, description, is_editable_by_app_admin, has_options, is_content_field, is_input_field, default_config, is_active, display_order)
VALUES (
  'Notification List',
  'notification_list',
  'lists',
  'bell',
  'Displays a list of user notifications with read/unread status',
  1,
  1,
  0,
  0,
  '{"show_unread_badge": true, "group_by_date": true, "enable_swipe_actions": true, "empty_message": "No notifications yet"}',
  1,
  125
);
