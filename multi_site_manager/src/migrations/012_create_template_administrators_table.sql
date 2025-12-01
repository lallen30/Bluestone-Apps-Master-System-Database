-- Migration: Create app_template_administrators table
-- Date: 2025-11-30

CREATE TABLE IF NOT EXISTS app_template_administrators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    user_id INT NOT NULL,
    can_view TINYINT(1) DEFAULT 1,
    can_edit TINYINT(1) DEFAULT 0,
    can_delete TINYINT(1) DEFAULT 0,
    can_publish TINYINT(1) DEFAULT 0,
    can_manage_users TINYINT(1) DEFAULT 0,
    can_manage_settings TINYINT(1) DEFAULT 0,
    custom_permissions JSON,
    granted_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_template_admin (template_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
