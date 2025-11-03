# 🚀 How to Resume Development in a New Cascade Session

## Quick Start Commands for Cascade

When starting a new Cascade conversation, use one of these commands to get back on track:

### **Option 1: Read Session Notes (RECOMMENDED)**
```
Please read SESSION_NOTES.md and let me know what we should work on next
```

### **Option 2: Use Memory**
```
I have a memory about "Mobile App API Implementation - Current Progress & Architecture". 
Can you review it and continue where we left off?
```

### **Option 3: Check Recent Work**
```
Show me the git commits from Nov 3, 2025 and let's continue the mobile API work
```

### **Option 4: Direct Request**
```
We're building a mobile app API. Phase 1 & 2 (authentication and user management) are complete.
Please read MOBILE_APP_API_TODO.md and SESSION_NOTES.md, then help me implement Phase 3: User Profile Management.
```

---

## 📚 Key Files to Reference

### **Must-Read Files:**
1. **SESSION_NOTES.md** - Complete summary of latest work
2. **MOBILE_APP_API_TODO.md** - Full API roadmap and progress
3. **TODO.md** - General project todos
4. **POPULAR_SCREENS.md** - Template screens progress

### **Architecture Files:**
- `multi_site_manager/src/` - Backend API code
- `admin_portal/app/` - Frontend admin portal
- `multi_site_manager/src/migrations/` - Database migrations

---

## ✅ Current Status (Nov 3, 2025)

### **What's Working:**
- ✅ Mobile authentication (register, login, logout, verify email)
- ✅ JWT token system (access & refresh tokens)
- ✅ Admin user management portal
- ✅ User CRUD operations
- ✅ User statistics dashboard
- ✅ Database tables: app_users, user_sessions, user_settings, user_activity_log

### **What's Next:**
- 🚧 User profile endpoints (GET/PUT)
- 🚧 Avatar upload functionality
- 🚧 Password reset flow
- 📋 Settings management
- 📋 Social features
- 📋 E-commerce features

---

## 🧪 Testing the Current System

### **Test Mobile Authentication:**
```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/mobile/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": 1,
    "email": "newuser@example.com",
    "password": "password123",
    "first_name": "New",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": 1,
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

### **Access Admin Portal:**
```
http://localhost:3001/app/1/app-users
```
Login with: `admin@knoxweb.com` / `admin123`

### **Database Access:**
```bash
# Access MySQL
docker exec -it multi_app_mysql mysql -u root -prootpassword multi_site_manager

# View users
SELECT * FROM app_users;

# View sessions
SELECT * FROM user_sessions;
```

---

## 🔧 Development Environment

### **Services Running:**
- **API Server:** http://localhost:3000 (Express.js)
- **Admin Portal:** http://localhost:3001 (Next.js)
- **MySQL Database:** localhost:3306
- **phpMyAdmin:** http://localhost:8080

### **Start Services:**
```bash
cd "/Users/lallen30/Documents/bluestoneapps/Bluestone Apps Master System"
docker-compose up -d
```

### **View Logs:**
```bash
# API logs
docker logs multi_app_api --tail 50

# Database logs
docker logs multi_app_mysql --tail 50

# Admin portal logs
docker logs multi_app_admin_portal --tail 50
```

### **Restart Services:**
```bash
# Restart API after code changes
docker-compose restart api

# Restart all services
docker-compose restart
```

---

## 📂 Project Structure

```
Bluestone Apps Master System/
├── SESSION_NOTES.md              ← Read this first!
├── MOBILE_APP_API_TODO.md        ← API roadmap
├── HOW_TO_RESUME.md              ← This file
├── TODO.md                       ← General todos
├── POPULAR_SCREENS.md            ← Template progress
│
├── multi_site_manager/           ← Backend API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── mobileAuthController.js      ← Mobile auth
│   │   │   └── appUsersController.js        ← Admin user mgmt
│   │   ├── routes/
│   │   │   ├── mobileAuth.js
│   │   │   └── appUsers.js
│   │   ├── middleware/
│   │   │   └── mobileAuth.js                ← JWT middleware
│   │   ├── utils/
│   │   │   └── jwt.js                       ← JWT utilities
│   │   └── migrations/
│   │       └── 001_create_mobile_app_users.sql
│   └── package.json
│
└── admin_portal/                 ← Frontend
    ├── app/
    │   └── app/[id]/
    │       ├── app-users/page.tsx           ← User management UI
    │       └── users/page.tsx               ← Admin permissions
    └── lib/
        └── api.ts                           ← API client
```

---

## 🎯 Next Development Tasks (Priority Order)

### **Phase 3: User Profile Management**

#### **Task 1: Profile GET Endpoint**
Create `GET /api/v1/mobile/profile` endpoint:
- Return current user's full profile
- Include: name, email, phone, bio, avatar, etc.
- Use JWT token to identify user

#### **Task 2: Profile UPDATE Endpoint**
Create `PUT /api/v1/mobile/profile` endpoint:
- Update user profile fields
- Validate input
- Return updated profile

#### **Task 3: Avatar Upload**
Create `POST /api/v1/mobile/profile/avatar` endpoint:
- Handle file upload (multipart/form-data)
- Resize/optimize image
- Store file (local or S3)
- Update user's avatar_url

#### **Task 4: Password Management**
Create password reset flow:
- `POST /api/v1/mobile/auth/forgot-password`
- `POST /api/v1/mobile/auth/reset-password`
- `PUT /api/v1/mobile/profile/password`

---

## 💡 Tips for Cascade

### **When Cascade Asks "What should we work on?"**
Say: "Let's implement Phase 3, Task 1: Create the GET /api/v1/mobile/profile endpoint"

### **If Cascade Seems Lost:**
Say: "Please read SESSION_NOTES.md first, then let's continue with the next task"

### **To See Recent Changes:**
Say: "Show me the git log from today and explain what was completed"

### **To Test What's Working:**
Say: "Let's test the authentication endpoints to make sure everything still works"

---

## 🐛 Common Issues & Solutions

### **Issue: Users not showing in admin portal**
- Check API logs: `docker logs multi_app_api --tail 50`
- Verify database: `SELECT * FROM app_users WHERE app_id = 1;`
- Check browser console for errors

### **Issue: Authentication not working**
- Verify JWT_SECRET is set in .env
- Check token expiration
- Verify user exists and is active

### **Issue: Database connection error**
- Restart MySQL: `docker-compose restart mysql`
- Check credentials in .env file
- Verify database exists: `SHOW DATABASES;`

### **Issue: API changes not reflecting**
- Restart API: `docker-compose restart api`
- Check for syntax errors in logs
- Verify file was saved

---

## 📞 Quick Reference

### **Test User:**
- Email: `larry@bluestoneapps.com`
- Password: (set during creation)
- App ID: 1

### **Admin Login:**
- Email: `admin@knoxweb.com`
- Password: `admin123`

### **Database:**
- Host: `localhost:3306`
- Database: `multi_site_manager`
- User: `root`
- Password: `rootpassword`

### **Important Endpoints:**
- Mobile Auth: `/api/v1/mobile/auth/*`
- Admin Users: `/api/v1/apps/:appId/users/*`
- Admin Portal: `http://localhost:3001/app/1/app-users`

---

## 🎉 You're Ready!

Just paste one of the "Quick Start Commands" at the top of this file into your new Cascade conversation, and you'll be back on track immediately!

**Recommended:** Start with Option 1 (Read SESSION_NOTES.md)
