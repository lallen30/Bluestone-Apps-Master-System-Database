# Multi-App Manager API

A comprehensive Node.js REST API for managing multiple webapps with hierarchical user permissions and role-based access control.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - Master Admin, Admin, and Editor roles
- 🌐 **Multi-App Management** - Manage multiple webapps from one system
- 🔑 **Granular Permissions** - Fine-grained permission control per user per app
- 📊 **Activity Logging** - Track all user actions for audit purposes
- 🛡️ **Security** - Rate limiting, helmet, CORS, input validation
- 📝 **RESTful API** - Clean and intuitive API design

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Prerequiapps

**Option 1: Docker (Recommended)**
- Docker
- Docker Compose

**Option 2: Local Development**
- Node.js v18 or higher
- MySQL 8.0
- npm or yarn

## Installation

### Option 1: Docker (Recommended)

The easiest way to run the entire stack (API + MySQL + phpMyAdmin) is using Docker.

#### Quick Start

```bash
cd multi_app_manager
chmod +x docker-start.sh
./docker-start.sh
```

Select your environment:
- **Production**: Optimized build, no hot-reload
- **Development**: Hot-reload enabled, debug logging

The script will:
- Build the Docker images
- Start all services (API, MySQL, phpMyAdmin)
- Initialize the database with schema and seed data
- Display access URLs

#### Manual Docker Commands

**Production:**
```bash
docker-compose up -d --build
```

**Development (with hot-reload):**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

**Stop services:**
```bash
./docker-stop.sh
# Or manually:
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f api
```

**Access:**
- API: http://localhost:3000
- API Health: http://localhost:3000/health
- phpMyAdmin: http://localhost:8080

---

### Option 2: Local Development

#### 1. Install Dependencies

```bash
cd multi_app_manager
npm install
```

#### 2. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=multi_app_manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### 3. Set Up Database

Make sure your MySQL database is running and the schema is imported:

```bash
# If using Docker from the phpmyadmin folder
cd ../phpmyadmin
./setup_database.sh
```

Or manually import via phpMyAdmin at http://localhost:8080

#### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at: `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 🔐 Authentication

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "master@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "master@example.com",
      "first_name": "Master",
      "last_name": "Administrator",
      "role_name": "Master Admin",
      "role_level": 1
    }
  }
}
```

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

#### Change Password
```http
POST /api/v1/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

---

### 👥 Users

**Note:** Most user endpoints require Admin or Master Admin privileges.

#### Get All Users
```http
GET /api/v1/users
Authorization: Bearer <token>

Query Parameters:
- role_id (optional): Filter by role (1, 2, or 3)
- is_active (optional): Filter by active status (true/false)
- search (optional): Search by email or name
```

#### Get User by ID
```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```

#### Create User (Master Admin only)
```http
POST /api/v1/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role_id": 3
}
```

#### Update User (Master Admin only)
```http
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Jane",
  "is_active": true
}
```

#### Delete User (Master Admin only)
```http
DELETE /api/v1/users/:id
Authorization: Bearer <token>
```

---

### 🌐 Apps

#### Get All Apps
```http
GET /api/v1/apps
Authorization: Bearer <token>

Query Parameters:
- is_active (optional): Filter by active status
- search (optional): Search by name or domain
```

**Note:** Users see only their assigned apps unless they are Master Admin.

#### Get App by ID
```http
GET /api/v1/apps/:id
Authorization: Bearer <token>
```

#### Create App (Master Admin only)
```http
POST /api/v1/apps
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Webapp",
  "domain": "newapp.example.com",
  "description": "Description of the app",
  "is_active": true
}
```

#### Update App
```http
PUT /api/v1/apps/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "is_active": false
}
```

**Requires:** Master Admin or `can_manage_settings` permission

#### Delete App (Master Admin only)
```http
DELETE /api/v1/apps/:id
Authorization: Bearer <token>
```

#### Get App Settings
```http
GET /api/v1/apps/:id/settings
Authorization: Bearer <token>
```

#### Update App Settings
```http
PUT /api/v1/apps/:id/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "theme": "modern-dark",
  "maintenance_mode": "false",
  "contact_email": "info@example.com"
}
```

**Requires:** `can_manage_settings` permission

---

### 🔑 Permissions

**Note:** All permission endpoints require Admin or Master Admin role.

#### Assign User to App
```http
POST /api/v1/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": 5,
  "app_id": 2,
  "can_view": true,
  "can_edit": true,
  "can_delete": false,
  "can_publish": true,
  "can_manage_users": false,
  "can_manage_settings": false
}
```

#### Update User Permissions
```http
PUT /api/v1/permissions/:user_id/:app_id
Authorization: Bearer <token>
Content-Type: application/json

{
  "can_publish": true,
  "can_delete": true
}
```

#### Remove User from App
```http
DELETE /api/v1/permissions/:user_id/:app_id
Authorization: Bearer <token>
```

#### Get User Permissions
```http
GET /api/v1/permissions/user/:user_id
Authorization: Bearer <token>
```

#### Get App Users
```http
GET /api/v1/permissions/app/:app_id
Authorization: Bearer <token>
```

---

## Permission Model

### Roles

| Role | Level | Description |
|------|-------|-------------|
| Master Admin | 1 | Full access to all apps and system settings |
| Admin | 2 | Can manage assigned apps and their users |
| Editor | 3 | Can edit content on assigned apps with limited permissions |

### Permission Flags

Each user-app relationship has these permissions:

- **can_view**: View app content and data
- **can_edit**: Edit existing content
- **can_delete**: Delete content
- **can_publish**: Publish/unpublish content
- **can_manage_users**: Add/remove users from app
- **can_manage_settings**: Modify app settings

### Permission Hierarchy

```
Master Admin
  └─ Automatic access to ALL apps
  └─ All permissions enabled
  └─ Can create/delete apps
  └─ Can manage all users

Admin
  └─ Access to assigned apps only
  └─ Full permissions on assigned apps
  └─ Can manage editors on their apps

Editor
  └─ Access to assigned apps only
  └─ Granular permissions per app
  └─ Cannot manage users
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message description",
  "errors": [] // Optional validation errors
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@example.com","password":"password123"}'
```

### Get Apps (with token)
```bash
curl -X GET http://localhost:3000/api/v1/apps \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create App
```bash
curl -X POST http://localhost:3000/api/v1/apps \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test App","domain":"test.example.com","description":"Test app"}'
```

---

## Development

### Project Structure

```
multi_app_manager/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── appController.js    # App management
│   │   └── permissionController.js # Permission management
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization
│   │   └── validator.js         # Input validation
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── appRoutes.js        # App endpoints
│   │   └── permissionRoutes.js  # Permission endpoints
│   └── server.js                # Main application
├── .env                         # Environment variables
├── .env.example                 # Example environment file
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # This file
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (when implemented)
- `npm run lint` - Run ESLint (when configured)

---

## Security Best Practices

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env` to a strong random string
2. **Use HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Configured by default (100 requests per 15 minutes)
4. **Password Policy**: Enforce strong passwords (minimum 8 characters)
5. **Input Validation**: All inputs are validated using express-validator
6. **SQL Injection**: Protected by using parameterized queries
7. **Activity Logging**: All sensitive actions are logged

---

## Troubleshooting

### Database Connection Failed

- Verify MySQL is running: `docker ps`
- Check database credentials in `.env`
- Ensure database `multi_app_manager` exists

### Port Already in Use

Change the port in `.env`:
```env
PORT=3001
```

### JWT Token Expired

Login again to get a new token. Token expiry is set in `.env`:
```env
JWT_EXPIRES_IN=24h
```

---

## License

ISC

## Support

For issues or questions, please refer to the database documentation in the `phpmyadmin` folder.
