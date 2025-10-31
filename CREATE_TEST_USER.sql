-- Create Test User for Dashboard Testing
-- Login to phpMyAdmin at http://localhost:8080
-- Database: multi_app_db
-- Run this SQL script

-- Password for test user is: test123
-- Hash generated with bcrypt

-- Create test user
INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active)
VALUES (
  'testuser@example.com',
  '$2a$10$rZ8qKqZ9qKqZ9qKqZ9qKqOeJ5vKx5vKx5vKx5vKx5vKx5vKx5vKxu',
  'Test',
  'User',
  3,
  1
);

-- Get the user ID
SET @test_user_id = LAST_INSERT_ID();

-- Assign user to first app with view and edit permissions
-- (You may need to adjust the app_id based on your apps table)
INSERT INTO user_app_permissions (
  user_id,
  app_id,
  can_view,
  can_edit,
  can_delete,
  can_publish,
  can_manage_users,
  can_manage_settings
)
SELECT 
  @test_user_id,
  id,
  1,  -- can_view
  1,  -- can_edit
  0,  -- can_delete
  0,  -- can_publish
  1,  -- can_manage_users
  0   -- can_manage_settings
FROM apps
LIMIT 1;

-- Verify the user was created
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  r.name as role_name,
  u.is_active
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email = 'testuser@example.com';

-- Verify permissions were assigned
SELECT 
  u.email,
  a.name as app_name,
  a.domain,
  uap.can_view,
  uap.can_edit,
  uap.can_manage_users
FROM user_app_permissions uap
JOIN users u ON uap.user_id = u.id
JOIN apps a ON uap.app_id = a.id
WHERE u.email = 'testuser@example.com';
