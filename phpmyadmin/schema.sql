-- Multi-App Management Database Schema
-- This schema supports multiple applications with hierarchical user permissions

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS user_app_permissions;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS app_settings;
DROP TABLE IF EXISTS apps;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    level INT NOT NULL COMMENT '1=Master Admin, 2=Admin, 3=Editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_role (role_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- APPS TABLE
-- ============================================
CREATE TABLE apps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_domain (domain),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- APP SETTINGS TABLE
-- ============================================
CREATE TABLE app_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    UNIQUE KEY unique_app_setting (app_id, setting_key),
    INDEX idx_app_key (app_id, setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER APP PERMISSIONS TABLE
-- ============================================
CREATE TABLE user_app_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    app_id INT NOT NULL,
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_publish BOOLEAN DEFAULT FALSE,
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_manage_settings BOOLEAN DEFAULT FALSE,
    custom_permissions JSON COMMENT 'Store additional custom permissions as JSON',
    granted_by INT NOT NULL COMMENT 'User ID who granted these permissions',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_user_app (user_id, app_id),
    INDEX idx_user (user_id),
    INDEX idx_app (app_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    app_id INT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON COMMENT 'Store additional context as JSON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_app (app_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VIEWS FOR EASIER QUERYING
-- ============================================

-- View: User permissions with role information
CREATE VIEW v_user_permissions AS
SELECT 
    u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    r.name AS role_name,
    r.level AS role_level,
    a.id AS app_id,
    a.name AS app_name,
    a.domain AS app_domain,
    uap.can_view,
    uap.can_edit,
    uap.can_delete,
    uap.can_publish,
    uap.can_manage_users,
    uap.can_manage_settings,
    uap.custom_permissions
FROM users u
JOIN roles r ON u.role_id = r.id
LEFT JOIN user_app_permissions uap ON u.id = uap.user_id
LEFT JOIN apps a ON uap.app_id = a.id
WHERE u.is_active = TRUE;

-- View: App overview with user counts
CREATE VIEW v_app_overview AS
SELECT 
    a.id,
    a.name,
    a.domain,
    a.is_active,
    COUNT(DISTINCT uap.user_id) AS total_users,
    a.created_at,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
FROM apps a
LEFT JOIN user_app_permissions uap ON a.id = uap.app_id
LEFT JOIN users u ON a.created_by = u.id
GROUP BY a.id, a.name, a.domain, a.is_active, a.created_at, u.first_name, u.last_name;
