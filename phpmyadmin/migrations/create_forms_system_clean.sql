-- ============================================================================
-- FORMS SYSTEM - Database Schema
-- ============================================================================

CREATE TABLE app_forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  form_key VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  form_type ENUM('create', 'edit', 'search', 'filter', 'multi_step', 'wizard') DEFAULT 'create',
  layout ENUM('single_column', 'two_column', 'grid', 'wizard') DEFAULT 'single_column',
  submit_button_text VARCHAR(50) DEFAULT 'Submit',
  success_message TEXT,
  error_message TEXT,
  icon VARCHAR(50),
  category VARCHAR(50),
  is_active TINYINT(1) DEFAULT 1,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_form_key (form_key),
  INDEX idx_category (category),
  INDEX idx_active (is_active),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE app_form_elements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  element_id INT NOT NULL,
  field_key VARCHAR(100) NOT NULL,
  label VARCHAR(255),
  placeholder VARCHAR(255),
  default_value TEXT,
  help_text TEXT,
  is_required TINYINT(1) DEFAULT 0,
  validation_rules JSON,
  display_order INT DEFAULT 0,
  column_span INT DEFAULT 1,
  row_span INT DEFAULT 1,
  show_if_field VARCHAR(100),
  show_if_value VARCHAR(255),
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_form_id (form_id),
  INDEX idx_element_id (element_id),
  INDEX idx_display_order (display_order),
  UNIQUE KEY unique_form_field (form_id, field_key),
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (element_id) REFERENCES screen_elements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE app_form_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  form_id INT NOT NULL,
  custom_name VARCHAR(100),
  custom_submit_text VARCHAR(50),
  custom_success_message TEXT,
  custom_config JSON,
  submit_endpoint VARCHAR(255),
  submit_method ENUM('POST', 'PUT', 'PATCH') DEFAULT 'POST',
  is_active TINYINT(1) DEFAULT 1,
  assigned_by INT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_app_id (app_id),
  INDEX idx_form_id (form_id),
  INDEX idx_active (is_active),
  UNIQUE KEY unique_app_form (app_id, form_id),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE app_form_element_overrides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  form_id INT NOT NULL,
  form_element_id INT NOT NULL,
  custom_label VARCHAR(255),
  custom_placeholder VARCHAR(255),
  custom_default_value TEXT,
  custom_help_text TEXT,
  is_required_override TINYINT(1),
  custom_validation_rules JSON,
  custom_config JSON,
  is_hidden TINYINT(1) DEFAULT 0,
  custom_display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_app_form (app_id, form_id),
  INDEX idx_form_element (form_element_id),
  UNIQUE KEY unique_app_form_element (app_id, form_id, form_element_id),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (form_element_id) REFERENCES app_form_elements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE app_form_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  form_id INT NOT NULL,
  user_id INT,
  form_data JSON NOT NULL,
  submission_ip VARCHAR(45),
  user_agent TEXT,
  status ENUM('pending', 'processing', 'completed', 'failed', 'rejected') DEFAULT 'pending',
  error_message TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  
  INDEX idx_app_form (app_id, form_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add form_id to screen_element_instances
ALTER TABLE screen_element_instances 
ADD COLUMN form_id INT NULL AFTER element_id,
ADD INDEX idx_form_id (form_id),
ADD CONSTRAINT fk_screen_element_form 
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE SET NULL;

SELECT 'Forms system tables created successfully!' as status;
