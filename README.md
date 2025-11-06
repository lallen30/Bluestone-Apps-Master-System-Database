# Bluestone Apps Master System

A comprehensive multi-tenant application management system with domain-based routing, role-based access control, and a modern admin portal.

## 🚀 Features

### Multi-App Manager API
- **RESTful API** built with Node.js & Express
- **MySQL Database** with comprehensive schema
- **JWT Authentication** with secure token management
- **Role-Based Access Control** (Master Admin, Admin, Editor)
- **Granular Permissions** per app (View, Edit, Delete, Publish, Manage Users, Manage Settings)
- **Activity Logging** for audit trails
- **Docker Support** for easy deployment

### Admin Portal
- **Next.js 14** with TypeScript
- **Domain-Based Multi-Tenancy** - Different login pages per domain
- **Master Admin Dashboard** - Manage all apps and users
- **App Management** - Full CRUD operations for applications
- **User Management** - Create, edit, delete users with permission assignment
- **Permission Management** - Assign users to apps with granular permissions
- **Responsive Design** with Tailwind CSS
- **Modern UI Components** with Lucide icons

## 📁 Project Structure

```
Bluestone Apps Master System/
├── admin_portal/          # Next.js admin portal
│   ├── app/              # Next.js 14 app directory
│   ├── components/       # React components
│   ├── lib/             # API client, state management, utilities
│   └── middleware.ts    # Domain detection middleware
├── multi_site_manager/   # Node.js API
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── middleware/  # Auth & validation middleware
│   │   ├── routes/      # API routes
│   │   └── config/      # Database configuration
│   └── docker-compose.yml
└── phpmyadmin/          # Database management
    ├── schema.sql       # Database schema
    └── seed_data.sql    # Sample data
```

## 🛠️ Tech Stack

### Backend (API)
- Node.js 18+
- Express.js
- MySQL 8.0
- JWT for authentication
- bcrypt for password hashing
- Docker & Docker Compose

### Frontend (Admin Portal)
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)
- Lucide React (icons)

## 📋 Prerequisites

- Node.js 18 or higher
- Docker & Docker Compose
- npm or yarn

## 🚀 Quick Start

### Option 1: Docker (Recommended - Everything in One Command)

```bash
# Clone the repository
git clone <your-repo-url>
cd "Bluestone Apps Master System"

# Start everything with Docker
./start.sh
```

This will start all services:
- **Admin Portal**: http://localhost:3001
- **API**: http://localhost:3000
- **MySQL Database**: localhost:3306
- **phpMyAdmin**: http://localhost:8080

### Option 2: Manual Setup

**Start API & Database:**
```bash
cd multi_site_manager
docker-compose -f docker-compose.dev.yml up -d
```

**Start Admin Portal:**
```bash
cd admin_portal
npm install
npm run dev
```

### 4. Login

Use these default credentials:

**Master Admin:**
- Email: `master@example.com`
- Password: `password123`

**Admin:**
- Email: `admin1@example.com`
- Password: `password123`

**Editor:**
- Email: `editor1@example.com`
- Password: `password123`

## 📖 Documentation

### API Documentation
See [multi_site_manager/README.md](multi_site_manager/README.md) for:
- API endpoints
- Authentication
- Request/response formats
- Database schema

### Admin Portal Documentation
See [admin_portal/README.md](admin_portal/README.md) for:
- Domain-based routing
- Permission system
- Development guide
- Deployment instructions

### Database Documentation
See [phpmyadmin/DATABASE_DOCUMENTATION.md](phpmyadmin/DATABASE_DOCUMENTATION.md) for:
- Schema details
- Table relationships
- Sample queries

## 🔧 Configuration

### API Configuration

Edit `multi_site_manager/.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=multi_site_manager

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:8080
```

### Admin Portal Configuration

Edit `admin_portal/.env.local`:

```env
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Multi-App Admin Portal
NEXT_PUBLIC_MASTER_DOMAIN=localhost:3001
```

## 🌐 Domain-Based Multi-Tenancy

The admin portal supports domain-based multi-tenancy. Different domains can show different login pages and admin experiences:

```
corporate.example.com → Corporate app login & dashboard
shop.example.com      → E-commerce app login & dashboard
blog.example.com      → Blog app login & dashboard
master.example.com    → Master admin portal (all apps)
```

### Local Testing

Add to `/etc/hosts`:

```
127.0.0.1 corporate.local
127.0.0.1 shop.local
127.0.0.1 master.local
```

Then access:
- http://corporate.local:3001
- http://shop.local:3001
- http://master.local:3001

## 👥 User Roles & Permissions

### Master Admin (Level 1)
- Full system access
- Manage all apps
- Manage all users
- Assign permissions

### Admin (Level 2)
- Access to assigned apps
- Full permissions within assigned apps
- Can manage users within their apps

### Editor (Level 3)
- Access to assigned apps
- Limited permissions (View, Edit by default)
- Cannot manage users or settings

### Granular Permissions
Each user-app relationship has 6 permission flags:
- **View** - View content
- **Edit** - Edit content
- **Delete** - Delete content
- **Publish** - Publish content
- **Manage Users** - Manage app users
- **Manage Settings** - Manage app settings

## 🐳 Docker Commands

### Start All Services (Recommended)
```bash
./start.sh
```

### Stop All Services
```bash
./stop.sh
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f admin_portal
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart api
docker-compose restart admin_portal
```

### Individual Service Management
```bash
# Start API only
cd multi_site_manager
docker-compose -f docker-compose.dev.yml up -d

# Start Admin Portal only
cd admin_portal
docker-compose -f docker-compose.dev.yml up -d
```

## 📊 Database Access

### phpMyAdmin
- URL: http://localhost:8080
- Server: `mysql_db`
- Username: `root`
- Password: `rootpassword`

### MySQL CLI
```bash
docker exec -it mysql_db mysql -uroot -prootpassword multi_site_manager
```

## 🧪 Testing

### Test API Health
```bash
curl http://localhost:3000/health
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@example.com","password":"password123"}'
```

## 🚀 Production Deployment

### API Deployment
1. Build Docker image: `docker build -t multi-app-api .`
2. Set production environment variables
3. Deploy to your hosting platform (AWS, DigitalOcean, etc.)

### Admin Portal Deployment
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or your hosting platform
3. Configure environment variables
4. Point domains to the deployment

## 📝 Development Workflow

### Adding a New App
1. Go to Master Dashboard → Manage Apps
2. Click "Create App"
3. Fill in app details (name, domain, description)
4. Assign users and permissions

### Adding a New User
1. Go to Master Dashboard → Manage Users
2. Click "Create User"
3. Fill in user details and select role
4. Click shield icon to assign apps and permissions

### Managing Permissions
1. Go to Manage Users
2. Click shield icon on any user
3. Check apps to grant access
4. Configure granular permissions per app
5. Save changes

## 🔐 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** with bcrypt
- **CORS Protection** with configurable origins
- **Rate Limiting** to prevent abuse
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with Helmet.js
- **Role-Based Access Control** at API level

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### CORS Errors
Ensure `CORS_ORIGIN` in API `.env` includes the admin portal URL:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:8080
```

### Database Connection Failed
1. Check MySQL is running: `docker ps`
2. Verify credentials in `.env`
3. Restart services: `docker-compose restart`

## 📈 Roadmap

- [ ] Activity logs viewer in admin portal
- [ ] Analytics dashboard with charts
- [ ] Bulk user operations
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] API rate limiting per user
- [ ] Content management features
- [ ] File upload and media library
- [ ] Audit trail export

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

Bluestone Apps

## 🙏 Acknowledgments

Built with modern web technologies and best practices for scalable multi-tenant applications.

---

**Status**: ✅ Production Ready - Core features complete, actively maintained

For detailed documentation, see the README files in each subdirectory.
