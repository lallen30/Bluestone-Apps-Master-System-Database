# Multi-Site Management Database Documentation

## Overview

This database is designed to manage multiple websites with a hierarchical user permission system. It supports three user roles with different access levels:

1. **Master Admin** - Full access to all sites and system settings
2. **Admin** - Can manage one or multiple assigned sites
3. **Editor** - Can edit content on assigned sites with granular permissions

## Database Schema

### Tables

#### 1. `roles`
Defines the three user roles in the system.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(50) | Role name (Master Admin, Admin, Editor) |
| description | TEXT | Role description |
| level | INT | Hierarchy level (1=Master, 2=Admin, 3=Editor) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 2. `users`
Stores all user accounts.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| email | VARCHAR(255) | Unique email address |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| first_name | VARCHAR(100) | User's first name |
| last_name | VARCHAR(100) | User's last name |
| role_id | INT | Foreign key to roles table |
| is_active | BOOLEAN | Account active status |
| last_login | TIMESTAMP | Last login timestamp |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 3. `sites`
Stores information about each website.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(255) | Site name |
| domain | VARCHAR(255) | Unique domain name |
| description | TEXT | Site description |
| is_active | BOOLEAN | Site active status |
| created_by | INT | Foreign key to users (creator) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### 4. `site_settings`
Stores key-value settings for each site.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| site_id | INT | Foreign key to sites |
| setting_key | VARCHAR(100) | Setting name |
| setting_value | TEXT | Setting value |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Unique constraint:** (site_id, setting_key)

#### 5. `user_site_permissions`
Defines granular permissions for users on specific sites.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| user_id | INT | Foreign key to users |
| site_id | INT | Foreign key to sites |
| can_view | BOOLEAN | Can view site content |
| can_edit | BOOLEAN | Can edit site content |
| can_delete | BOOLEAN | Can delete site content |
| can_publish | BOOLEAN | Can publish content |
| can_manage_users | BOOLEAN | Can manage site users |
| can_manage_settings | BOOLEAN | Can manage site settings |
| custom_permissions | JSON | Additional custom permissions |
| granted_by | INT | Foreign key to users (who granted) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Unique constraint:** (user_id, site_id)

#### 6. `activity_logs`
Tracks all user actions for audit purposes.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | INT | Foreign key to users |
| site_id | INT | Foreign key to sites (nullable) |
| action | VARCHAR(100) | Action type |
| description | TEXT | Action description |
| ip_address | VARCHAR(45) | User's IP address |
| user_agent | TEXT | User's browser/client |
| metadata | JSON | Additional context data |
| created_at | TIMESTAMP | Action timestamp |

### Views

#### `v_user_permissions`
Combines user, role, site, and permission data for easy querying.

**Columns:** user_id, email, first_name, last_name, role_name, role_level, site_id, site_name, site_domain, can_view, can_edit, can_delete, can_publish, can_manage_users, can_manage_settings, custom_permissions

#### `v_site_overview`
Provides site summary with user counts.

**Columns:** id, name, domain, is_active, total_users, created_at, created_by_name

## Permission Model

### Role Hierarchy

```
Master Admin (Level 1)
    ├── Access to ALL sites automatically
    ├── Can create/delete sites
    ├── Can manage all users
    └── Can assign admins and editors
    
Admin (Level 2)
    ├── Access to assigned sites only
    ├── Full permissions on assigned sites
    ├── Can manage editors on their sites
    └── Cannot access other admins' sites
    
Editor (Level 3)
    ├── Access to assigned sites only
    ├── Granular permissions per site
    ├── Cannot manage users
    └── Permissions set by admins
```

### Permission Flags

Each user-site relationship can have these permissions:

- **can_view**: View site content and data
- **can_edit**: Edit existing content
- **can_delete**: Delete content
- **can_publish**: Publish/unpublish content
- **can_manage_users**: Add/remove users from site
- **can_manage_settings**: Modify site settings

### Custom Permissions

The `custom_permissions` JSON field allows for extensible permissions:

```json
{
  "can_manage_media": true,
  "can_export_data": false,
  "max_file_upload_mb": 50,
  "allowed_content_types": ["post", "page"]
}
```

## Installation

### 1. Import the Schema

```bash
# Access MySQL in Docker
docker exec -it mysql_db mysql -uroot -prootpassword

# Create the database
CREATE DATABASE multi_site_manager;
USE multi_site_manager;

# Import schema
SOURCE /path/to/schema.sql;

# Import seed data (optional)
SOURCE /path/to/seed_data.sql;
```

Or use phpMyAdmin:
1. Navigate to http://localhost:8080
2. Login with root credentials
3. Create database: `multi_site_manager`
4. Go to Import tab
5. Upload `schema.sql`
6. Upload `seed_data.sql` (optional)

### 2. Verify Installation

```sql
-- Check all tables were created
SHOW TABLES;

-- Check row counts
SELECT 'roles' AS table_name, COUNT(*) AS count FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'sites', COUNT(*) FROM sites
UNION ALL SELECT 'user_site_permissions', COUNT(*) FROM user_site_permissions;
```

## Common Queries

### Get all sites a user can access

```sql
SELECT s.*, usp.can_edit, usp.can_publish
FROM sites s
JOIN user_site_permissions usp ON s.id = usp.site_id
WHERE usp.user_id = ? AND s.is_active = TRUE;
```

### Get all users for a specific site

```sql
SELECT u.*, r.name AS role, usp.can_edit, usp.can_publish
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN user_site_permissions usp ON u.id = usp.user_id
WHERE usp.site_id = ? AND u.is_active = TRUE;
```

### Check if user has specific permission

```sql
SELECT 
    CASE 
        WHEN r.level = 1 THEN TRUE  -- Master admin has all permissions
        WHEN usp.can_publish = TRUE THEN TRUE
        ELSE FALSE
    END AS has_permission
FROM users u
JOIN roles r ON u.role_id = r.id
LEFT JOIN user_site_permissions usp ON u.id = usp.user_id AND usp.site_id = ?
WHERE u.id = ?;
```

### Get user's activity history

```sql
SELECT al.*, s.name AS site_name
FROM activity_logs al
LEFT JOIN sites s ON al.site_id = s.id
WHERE al.user_id = ?
ORDER BY al.created_at DESC
LIMIT 50;
```

### Get site statistics

```sql
SELECT 
    s.name,
    s.domain,
    COUNT(DISTINCT usp.user_id) AS total_users,
    COUNT(DISTINCT CASE WHEN r.level = 2 THEN u.id END) AS admin_count,
    COUNT(DISTINCT CASE WHEN r.level = 3 THEN u.id END) AS editor_count
FROM sites s
LEFT JOIN user_site_permissions usp ON s.id = usp.site_id
LEFT JOIN users u ON usp.user_id = u.id
LEFT JOIN roles r ON u.role_id = r.id
WHERE s.is_active = TRUE
GROUP BY s.id, s.name, s.domain;
```

## Security Considerations

1. **Password Hashing**: Always use bcrypt or Argon2 for password hashing
2. **SQL Injection**: Use prepared statements in your application
3. **Access Control**: Always verify user permissions before operations
4. **Activity Logging**: Log all sensitive operations for audit trails
5. **Soft Deletes**: Consider adding `deleted_at` columns instead of hard deletes
6. **Rate Limiting**: Implement at application level for login attempts
7. **Session Management**: Store sessions securely with appropriate timeouts

## Backup Strategy

```bash
# Backup entire database
docker exec mysql_db mysqldump -uroot -prootpassword multi_site_manager > backup.sql

# Backup specific tables
docker exec mysql_db mysqldump -uroot -prootpassword multi_site_manager users sites > users_sites_backup.sql

# Restore from backup
docker exec -i mysql_db mysql -uroot -prootpassword multi_site_manager < backup.sql
```

## Future Enhancements

Consider adding these features:

1. **API Keys Table**: For programmatic access
2. **Teams/Groups**: Group users for easier permission management
3. **Permission Templates**: Predefined permission sets
4. **Two-Factor Authentication**: Add 2FA fields to users table
5. **Site Categories**: Organize sites into categories
6. **Content Versioning**: Track content changes
7. **Notifications**: User notification preferences and queue
8. **File Management**: Track uploaded files per site

## Support

For questions or issues with this database schema, refer to:
- MySQL Documentation: https://dev.mysql.com/doc/
- Database design best practices
- Your application's specific requirements
