-- Create table for storing form submissions from mobile apps
CREATE TABLE IF NOT EXISTS screen_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  user_id INT NULL,
  submission_data JSON NOT NULL,
  device_info VARCHAR(255),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE SET NULL,
  
  INDEX idx_app_screen (app_id, screen_id),
  INDEX idx_user (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
