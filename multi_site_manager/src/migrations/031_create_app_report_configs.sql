-- Migration: Create app_report_configs table
-- Description: Stores report configuration for screens marked as reports
-- Created: 2025-12-02

-- Report configurations for screens
CREATE TABLE IF NOT EXISTS app_report_configs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  
  -- Display settings
  report_name VARCHAR(255),
  description TEXT,
  
  -- Column configuration (JSON array of field_keys to display)
  display_columns JSON,
  
  -- Filter configuration (JSON array of field_keys that can be filtered)
  filter_fields JSON,
  
  -- Action buttons configuration (JSON array: ['view', 'edit', 'delete', 'export'])
  action_buttons JSON,
  
  -- Sorting defaults
  default_sort_field VARCHAR(100),
  default_sort_order ENUM('asc', 'desc') DEFAULT 'desc',
  
  -- Pagination
  rows_per_page INT DEFAULT 25,
  
  -- Role access (JSON array of role_ids that can view this report, empty = Master Admin only)
  allowed_roles JSON,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Constraints
  UNIQUE KEY unique_app_screen_report (app_id, screen_id),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_app_id (app_id),
  INDEX idx_screen_id (screen_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Created app_report_configs table' as message;
