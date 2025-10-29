# Changelog

## [1.0.0] - 2025-10-29

### Changed - Site to App Terminology Migration
- **Database**: Renamed all tables from `sites` to `apps`
  - `sites` → `apps`
  - `site_settings` → `app_settings`
  - `user_site_permissions` → `user_app_permissions`
  - All `site_id` columns → `app_id`
  - Views updated: `v_site_overview` → `v_app_overview`

- **API Endpoints**: Updated all endpoint paths
  - `/api/v1/sites` → `/api/v1/apps`
  - All site-related endpoints now use "apps" terminology

- **Controllers**: Renamed and updated
  - `siteController.js` → `appController.js`
  - All functions updated to use "app" terminology

- **Routes**: Renamed and updated
  - `siteRoutes.js` → `appRoutes.js`

- **Documentation**: Updated all references
  - README.md, QUICKSTART.md, DOCKER.md, SETUP.md
  - Postman collection updated
  - Package.json updated

### Fixed
- Password hash compatibility issue (PHP bcrypt → Node.js bcryptjs)
- Docker networking configuration for shared MySQL instance

### Added
- Complete Docker support with development and production configurations
- Comprehensive API documentation
- Postman collection for API testing
- Database migration scripts
- Health check endpoints

---

## Project Structure

```
multi_site_manager/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── appController.js
│   │   ├── authController.js
│   │   ├── permissionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validator.js
│   ├── routes/
│   │   ├── appRoutes.js
│   │   ├── authRoutes.js
│   │   ├── permissionRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── Docker files
├── Documentation
└── Configuration files
```

## API Endpoints

- **Auth**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Apps**: `/api/v1/apps/*`
- **Permissions**: `/api/v1/permissions/*`

## Database Schema

- `roles` - User roles (Master Admin, Admin, Editor)
- `users` - User accounts
- `apps` - Applications
- `app_settings` - Application settings
- `user_app_permissions` - User permissions per app
- `activity_logs` - Audit trail

---

**Status**: Production Ready ✅
