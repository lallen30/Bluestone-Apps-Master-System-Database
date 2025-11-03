-- Migration: Create Roles and Permissions System
-- Description: Add flexible role-based access control for app users
-- Date: 2025-11-03

-- Create roles table
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `app_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_role_per_app` (`app_id`, `name`),
  FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE CASCADE,
  INDEX `idx_app_id` (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create permissions table
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create role_permission_assignments (many-to-many)
CREATE TABLE IF NOT EXISTS `role_permission_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_role_permission` (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `user_roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `role_permissions`(`id`) ON DELETE CASCADE,
  INDEX `idx_role_id` (`role_id`),
  INDEX `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create app_user_role_assignments (many-to-many)
CREATE TABLE IF NOT EXISTS `app_user_role_assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  `assigned_by` INT,
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_role` (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `app_users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `user_roles`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default permissions
INSERT INTO `role_permissions` (`name`, `display_name`, `description`, `category`) VALUES
-- Content permissions
('content.create', 'Create Content', 'Can create posts, articles, or content', 'content'),
('content.edit', 'Edit Content', 'Can edit own content', 'content'),
('content.edit.all', 'Edit All Content', 'Can edit any user content', 'content'),
('content.delete', 'Delete Content', 'Can delete own content', 'content'),
('content.delete.all', 'Delete All Content', 'Can delete any user content', 'content'),
('content.publish', 'Publish Content', 'Can publish content', 'content'),

-- Comment permissions
('comments.create', 'Create Comments', 'Can post comments', 'comments'),
('comments.edit', 'Edit Comments', 'Can edit own comments', 'comments'),
('comments.delete', 'Delete Comments', 'Can delete own comments', 'comments'),
('comments.moderate', 'Moderate Comments', 'Can moderate all comments', 'comments'),

-- User permissions
('users.view', 'View Users', 'Can view user profiles', 'users'),
('users.follow', 'Follow Users', 'Can follow other users', 'users'),
('users.message', 'Message Users', 'Can send direct messages', 'users'),
('users.block', 'Block Users', 'Can block other users', 'users'),

-- Moderation permissions
('moderation.reports', 'Handle Reports', 'Can view and handle user reports', 'moderation'),
('moderation.ban', 'Ban Users', 'Can ban users from the app', 'moderation'),
('moderation.content', 'Moderate Content', 'Can moderate all content', 'moderation'),

-- Commerce permissions
('commerce.purchase', 'Make Purchases', 'Can purchase items', 'commerce'),
('commerce.sell', 'Sell Items', 'Can list items for sale', 'commerce'),
('commerce.refund', 'Process Refunds', 'Can process refunds', 'commerce'),

-- Analytics permissions
('analytics.view', 'View Analytics', 'Can view analytics and insights', 'analytics'),
('analytics.export', 'Export Data', 'Can export analytics data', 'analytics');

-- Insert default roles for each app (will be done via API when app is created)
-- Example default roles:
-- 1. User (default) - basic permissions
-- 2. Moderator - content moderation
-- 3. Premium - enhanced features
-- 4. Admin - full access

-- Note: Default roles will be created programmatically per app
