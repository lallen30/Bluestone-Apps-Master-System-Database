-- Screen Elements Table
-- This defines the available element types that can be added to screens
CREATE TABLE IF NOT EXISTS `screen_elements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `element_type` VARCHAR(50) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `description` TEXT,
  `is_editable_by_app_admin` TINYINT(1) DEFAULT 1 COMMENT 'Can app admin edit this element content',
  `has_options` TINYINT(1) DEFAULT 0 COMMENT 'Does this element have selectable options (dropdown, radio, etc)',
  `is_content_field` TINYINT(1) DEFAULT 0 COMMENT 'Is this a content field (heading, paragraph, etc)',
  `is_input_field` TINYINT(1) DEFAULT 1 COMMENT 'Is this an input field for mobile app users',
  `default_config` JSON DEFAULT NULL COMMENT 'Default configuration for this element type',
  `validation_rules` JSON DEFAULT NULL COMMENT 'Available validation rules',
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_element_type` (`element_type`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Screens Table
-- Screens created by master admin that can be assigned to apps
CREATE TABLE IF NOT EXISTS `app_screens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `screen_key` VARCHAR(100) NOT NULL COMMENT 'Unique identifier for the screen template',
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_screen_key` (`screen_key`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`is_active`),
  KEY `fk_screen_created_by` (`created_by`),
  CONSTRAINT `fk_screen_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Screen Element Instances Table
-- Elements added to a specific screen template
CREATE TABLE IF NOT EXISTS `screen_element_instances` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `screen_id` INT NOT NULL,
  `element_id` INT NOT NULL,
  `field_key` VARCHAR(100) NOT NULL COMMENT 'Unique key for this field instance',
  `label` VARCHAR(255) NOT NULL,
  `placeholder` VARCHAR(255) DEFAULT NULL,
  `default_value` TEXT DEFAULT NULL,
  `is_required` TINYINT(1) DEFAULT 0,
  `is_readonly` TINYINT(1) DEFAULT 0,
  `display_order` INT DEFAULT 0,
  `config` JSON DEFAULT NULL COMMENT 'Element-specific configuration',
  `validation_rules` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_screen_field` (`screen_id`, `field_key`),
  KEY `idx_screen` (`screen_id`),
  KEY `idx_element` (`element_id`),
  KEY `idx_display_order` (`display_order`),
  CONSTRAINT `fk_instance_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_instance_element` FOREIGN KEY (`element_id`) REFERENCES `screen_elements` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Screen Assignments Table
-- Assigns screens to specific apps
CREATE TABLE IF NOT EXISTS `app_screen_assignments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app_id` INT NOT NULL,
  `screen_id` INT NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_app_screen` (`app_id`, `screen_id`),
  KEY `idx_app` (`app_id`),
  KEY `idx_screen` (`screen_id`),
  KEY `idx_active` (`is_active`),
  KEY `fk_assignment_assigned_by` (`assigned_by`),
  CONSTRAINT `fk_assignment_app` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignment_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignment_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Screen Content Table
-- Content for screen elements specific to each app
CREATE TABLE IF NOT EXISTS `app_screen_content` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app_id` INT NOT NULL,
  `screen_id` INT NOT NULL,
  `element_instance_id` INT NOT NULL,
  `content_value` LONGTEXT DEFAULT NULL COMMENT 'The actual content/value for this element',
  `options` JSON DEFAULT NULL COMMENT 'Options for dropdown, radio, checkbox, etc',
  `updated_by` INT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_app_screen_element` (`app_id`, `screen_id`, `element_instance_id`),
  KEY `idx_app_screen` (`app_id`, `screen_id`),
  KEY `idx_element_instance` (`element_instance_id`),
  KEY `fk_content_updated_by` (`updated_by`),
  CONSTRAINT `fk_content_app` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_content_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_content_element_instance` FOREIGN KEY (`element_instance_id`) REFERENCES `screen_element_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_content_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX idx_content_app_screen ON app_screen_content(app_id, screen_id);
CREATE INDEX idx_assignment_app_active ON app_screen_assignments(app_id, is_active);
CREATE INDEX idx_instance_screen_order ON screen_element_instances(screen_id, display_order);
