-- App Modules Table
-- Reusable navigation and UI modules that can be assigned to screens
CREATE TABLE IF NOT EXISTS `app_modules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `module_type` ENUM('header_bar', 'footer_bar', 'floating_action_button') NOT NULL,
  `description` TEXT,
  `default_config` JSON DEFAULT NULL COMMENT 'Default configuration for this module type',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_module_type` (`module_type`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Screen Module Assignments Table
-- Links modules to specific screens with custom configuration
CREATE TABLE IF NOT EXISTS `screen_module_assignments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `screen_id` INT NOT NULL,
  `module_id` INT NOT NULL,
  `config` JSON DEFAULT NULL COMMENT 'Screen-specific module configuration',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_screen_module` (`screen_id`, `module_id`),
  KEY `idx_screen` (`screen_id`),
  KEY `idx_module` (`module_id`),
  CONSTRAINT `fk_screen_module_screen` FOREIGN KEY (`screen_id`) REFERENCES `app_screens` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_screen_module_module` FOREIGN KEY (`module_id`) REFERENCES `app_modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data for app_modules
INSERT INTO `app_modules` (`name`, `module_type`, `description`, `default_config`) VALUES
('Header Bar with Sidebar Icons', 'header_bar', 'Top navigation bar that displays menu icons for left and right sidebars', JSON_OBJECT(
  'showTitle', true,
  'backgroundColor', '#FFFFFF',
  'textColor', '#000000',
  'showLeftIcon', true,
  'showRightIcon', false,
  'elevation', 2
)),
('Simple Header Bar', 'header_bar', 'Basic header bar with title only', JSON_OBJECT(
  'showTitle', true,
  'backgroundColor', '#007AFF',
  'textColor', '#FFFFFF',
  'showLeftIcon', false,
  'showRightIcon', false,
  'elevation', 2
));
