# Multi-App Admin Portal

Domain-based multi-tenant admin portal for managing multiple applications. One codebase that displays different login pages and admin experiences based on the domain.

## Features

- 🌐 **Domain-Based Multi-Tenancy** - Different login pages per domain
- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access** - Master Admin, Admin, and Editor roles
- 🎨 **Dynamic Theming** - Each app can have its own branding
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Built with Next.js 14** - Fast, modern, and SEO-friendly

## How It Works

```
corporate.example.com/admin → Corporate branded login & dashboard
shop.example.com/admin → E-commerce branded login & dashboard
blog.example.com/admin → Blog branded login & dashboard
master.example.com → Master admin portal (all apps)
```

**Single codebase** detects the domain and shows:
- Custom login page with app branding
- App-specific dashboard
- Only relevant features for that app
- Master admin sees everything

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Running Multi-App Manager API (port 3000)

## Installation

### 1. Install Dependencies

```bash
cd admin_portal
npm install
```

### 2. Configure Environment

The `.env.local` file is already configured for local development:

```env
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Multi-App Admin Portal
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_MASTER_DOMAIN=localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The portal will be available at: **http://localhost:3001**

## Usage

### Local Development

For local development, the portal runs on `localhost:3001`:

- **Master Admin**: http://localhost:3001 (detects localhost as master)
- **App Login**: You'll need to set up domain mapping (see below)

### Testing Different Domains Locally

To test domain-based login pages locally, add entries to your `/etc/hosts` file:

```bash
sudo nano /etc/hosts
```

Add these lines:

```
127.0.0.1 corporate.local
127.0.0.1 shop.local
127.0.0.1 blog.local
127.0.0.1 master.local
```

Then access:
- http://corporate.local:3001 → Corporate app login
- http://shop.local:3001 → Shop app login
- http://master.local:3001 → Master admin login

### Login Credentials

Use the credentials from your API seed data:

**Master Admin:**
- Email: `master@example.com`
- Password: `password123`

**Admin:**
- Email: `admin1@example.com`
- Password: `password123`

**Editor:**
- Email: `editor1@example.com`
- Password: `password123`

## Project Structure

```
admin_portal/
├── app/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects)
│   ├── login/
│   │   └── page.tsx             # Dynamic login page
│   ├── dashboard/               # App dashboard (coming soon)
│   └── master/                  # Master admin (coming soon)
├── components/
│   └── login/
│       ├── LoginForm.tsx        # Shared login form
│       ├── MasterLogin.tsx      # Master admin login
│       └── AppLogin.tsx         # App-specific login
├── lib/
│   ├── api.ts                   # API client
│   ├── store.ts                 # Zustand state management
│   └── utils.ts                 # Utility functions
├── middleware.ts                # Domain detection
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Dependencies
```

## API Integration

The portal connects to your Multi-App Manager API:

### Required API Endpoints

✅ Already implemented:
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/auth/profile` - Get user profile
- `GET /api/v1/apps` - Get all apps
- `GET /api/v1/apps/:id` - Get app by ID

🔜 Need to add:
- `GET /api/v1/apps/by-domain/:domain` - Get app by domain

### Adding the Domain Endpoint

Add this to your API's `appController.js`:

```javascript
const getAppByDomain = async (req, res) => {
  try {
    const domain = req.params.domain;
    
    const app = await queryOne(
      `SELECT * FROM apps WHERE domain = ? AND is_active = TRUE`,
      [domain]
    );
    
    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found for this domain'
      });
    }
    
    res.json({
      success: true,
      data: app
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get app',
      error: error.message
    });
  }
};
```

Add the route in `appRoutes.js`:

```javascript
router.get('/by-domain/:domain', getAppByDomain);
```

## Database Setup

### Add Domain Field to Apps Table

If not already added:

```sql
ALTER TABLE apps ADD COLUMN domain_primary VARCHAR(255) UNIQUE;
ALTER TABLE apps ADD COLUMN app_type VARCHAR(50);
ALTER TABLE apps ADD COLUMN theme_config JSON;

-- Update existing apps
UPDATE apps SET 
  domain_primary = 'corporate.example.com',
  app_type = 'corporate'
WHERE id = 1;

UPDATE apps SET 
  domain_primary = 'shop.example.com',
  app_type = 'ecommerce'
WHERE id = 2;
```

## Development

### Available Scripts

- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

The portal is structured to be easily extensible:

1. **Add new pages** in `app/` directory
2. **Add new components** in `components/` directory
3. **Add new API calls** in `lib/api.ts`
4. **Add new state** in `lib/store.ts`

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Set Environment Variables

Create `.env.production`:

```env
API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. Deploy

**Option A: Docker (Recommended)**

See `Dockerfile` and `docker-compose.yml` (coming soon)

**Option B: Vercel/Netlify**

```bash
# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod
```

### 4. DNS Configuration

Point all your domains to the same server:

```
A Record: corporate.example.com → Your Server IP
A Record: shop.example.com → Your Server IP
A Record: blog.example.com → Your Server IP
A Record: master.example.com → Your Server IP
```

## Roadmap

### ✅ Phase 1: Authentication (Current)
- [x] Domain detection middleware
- [x] Dynamic login pages
- [x] JWT authentication
- [x] Role-based routing

### 🚧 Phase 2: Dashboard (Next)
- [ ] App dashboard layout
- [ ] App switcher component
- [ ] User profile page
- [ ] Settings page

### 📋 Phase 3: Content Management
- [ ] Content CRUD operations
- [ ] Media library
- [ ] User management
- [ ] Permission management

### 🎯 Phase 4: Master Admin
- [ ] Master dashboard
- [ ] All apps overview
- [ ] System analytics
- [ ] User management across apps

## Troubleshooting

### Port 3001 Already in Use

Change the port in `package.json`:

```json
"scripts": {
  "dev": "next dev -p 3002"
}
```

### API Connection Failed

1. Ensure the API is running on port 3000
2. Check `.env.local` has correct API_URL
3. Verify CORS is enabled in the API

### Domain Detection Not Working

1. Check middleware.ts is configured correctly
2. Verify domain is in the `apps` table
3. Check browser console for errors

## Contributing

This is a custom admin portal. To add features:

1. Create feature branch
2. Add components/pages
3. Test with multiple domains
4. Submit for review

## License

ISC

## Support

For issues or questions, refer to the main API documentation in the `multi_site_manager` folder.

---

**Status**: 🚧 In Development - Authentication Complete, Dashboard Coming Soon
