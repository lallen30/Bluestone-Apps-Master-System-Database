-- Seed Data for Multi-Site Management System
-- This file contains example data to demonstrate the system

-- ============================================
-- INSERT ROLES
-- ============================================
INSERT INTO roles (name, description, level) VALUES
('Master Admin', 'Full access to all sites and system settings', 1),
('Admin', 'Can manage assigned sites and their users', 2),
('Editor', 'Can edit content on assigned sites with limited permissions', 3);

-- ============================================
-- INSERT USERS
-- ============================================
-- Note: Passwords are hashed using bcrypt. These are examples only.
-- Password for all users: 'password123' (you should change these!)
-- Hash generated with bcryptjs (Node.js compatible)

INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active) VALUES
-- Master Admin
('master@example.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Master', 'Administrator', 1, TRUE),

-- Admins
('admin1@example.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'John', 'Smith', 2, TRUE),
('admin2@example.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Sarah', 'Johnson', 2, TRUE),

-- Editors
('editor1@example.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Mike', 'Davis', 3, TRUE),
('editor2@example.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'Emily', 'Wilson', 3, TRUE),
('editor3@example.com', '$2a$10$8q9FEMfJA/kizISo4eYfJOefu1nREhK5GOkUr141hHlOGPzY5V33q', 'David', 'Brown', 3, TRUE);

-- ============================================
-- INSERT APPS
-- ============================================
INSERT INTO apps (name, domain, description, is_active, created_by) VALUES
('Main Corporate App', 'corporate.example.com', 'Primary corporate application', TRUE, 1),
('E-commerce Store', 'shop.example.com', 'Online store for products', TRUE, 1),
('Blog Platform', 'blog.example.com', 'Company blog and news', TRUE, 1),
('Customer Portal', 'portal.example.com', 'Customer support and resources', TRUE, 1);

-- ============================================
-- INSERT APP SETTINGS
-- ============================================
INSERT INTO app_settings (app_id, setting_key, setting_value) VALUES
-- Corporate App Settings
(1, 'theme', 'corporate-blue'),
(1, 'maintenance_mode', 'false'),
(1, 'contact_email', 'info@corporate.example.com'),

-- E-commerce Settings
(2, 'theme', 'shop-modern'),
(2, 'currency', 'USD'),
(2, 'payment_gateway', 'stripe'),
(2, 'maintenance_mode', 'false'),

-- Blog Settings
(3, 'theme', 'blog-minimal'),
(3, 'posts_per_page', '10'),
(3, 'allow_comments', 'true'),

-- Portal Settings
(4, 'theme', 'portal-dashboard'),
(4, 'support_email', 'support@example.com');

-- ============================================
-- INSERT USER APP PERMISSIONS
-- ============================================

-- Admin 1 (John Smith) - Manages Corporate App and E-commerce
INSERT INTO user_app_permissions 
(user_id, app_id, can_view, can_edit, can_delete, can_publish, can_manage_users, can_manage_settings, granted_by) 
VALUES
-- Full admin access to Corporate App
(2, 1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 1),
-- Full admin access to E-commerce
(2, 2, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 1);

-- Admin 2 (Sarah Johnson) - Manages Blog and Customer Portal
INSERT INTO user_app_permissions 
(user_id, app_id, can_view, can_edit, can_delete, can_publish, can_manage_users, can_manage_settings, granted_by) 
VALUES
-- Full admin access to Blog
(3, 3, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 1),
-- Full admin access to Portal
(3, 4, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 1);

-- Editor 1 (Mike Davis) - Works on Corporate App with limited permissions
INSERT INTO user_app_permissions 
(user_id, app_id, can_view, can_edit, can_delete, can_publish, can_manage_users, can_manage_settings, granted_by) 
VALUES
(4, 1, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 2);

-- Editor 2 (Emily Wilson) - Works on E-commerce and Blog
INSERT INTO user_app_permissions 
(user_id, app_id, can_view, can_edit, can_delete, can_publish, can_manage_users, can_manage_settings, granted_by) 
VALUES
-- Can edit and publish on E-commerce
(5, 2, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, 2),
-- Can only edit on Blog (cannot publish)
(5, 3, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 3);

-- Editor 3 (David Brown) - Works on Blog and Portal
INSERT INTO user_app_permissions 
(user_id, app_id, can_view, can_edit, can_delete, can_publish, can_manage_users, can_manage_settings, granted_by) 
VALUES
-- Can edit and publish on Blog
(6, 3, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, 3),
-- Can only view and edit Portal
(6, 4, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 3);

-- ============================================
-- INSERT SAMPLE ACTIVITY LOGS
-- ============================================
INSERT INTO activity_logs (user_id, app_id, action, description, ip_address) VALUES
(1, NULL, 'system.login', 'Master admin logged in', '192.168.1.100'),
(2, 1, 'app.update', 'Updated corporate app settings', '192.168.1.101'),
(4, 1, 'content.edit', 'Edited homepage content', '192.168.1.102'),
(5, 2, 'product.create', 'Added new product to store', '192.168.1.103'),
(6, 3, 'post.publish', 'Published new blog post', '192.168.1.104');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Uncomment these to verify the data was inserted correctly

-- SELECT 'Roles' AS table_name, COUNT(*) AS count FROM roles
-- UNION ALL
-- SELECT 'Users', COUNT(*) FROM users
-- UNION ALL
-- SELECT 'Apps', COUNT(*) FROM apps
-- UNION ALL
-- SELECT 'App Settings', COUNT(*) FROM app_settings
-- UNION ALL
-- SELECT 'User App Permissions', COUNT(*) FROM user_app_permissions
-- UNION ALL
-- SELECT 'Activity Logs', COUNT(*) FROM activity_logs;
