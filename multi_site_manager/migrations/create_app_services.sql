-- App Services Table
-- Tracks which services are enabled for each app/project

CREATE TABLE IF NOT EXISTS app_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_id VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  config JSON NULL COMMENT 'Service-specific configuration (encrypted sensitive data)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL,
  
  UNIQUE KEY unique_app_service (app_id, service_name),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_app_id (app_id),
  INDEX idx_service_name (service_name),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks which external services are enabled for each app';
