# Ubuntu Server Deployment Guide

This guide provides step-by-step instructions for deploying the Bluestone Apps Master System on an Ubuntu server after cloning from GitHub.

## Prerequisites

- Ubuntu Server 20.04 LTS or newer
- Root or sudo access
- Domain name (optional, but recommended for production)

## 1. System Updates and Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required dependencies
sudo apt install -y git curl wget build-essential
```

## 2. Install Node.js and npm

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

## 3. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
# Or run: newgrp docker
```

## 4. Clone the Repository

```bash
# Navigate to your preferred directory
cd /opt  # or ~/apps or wherever you prefer

# Clone the repository
git clone <your-github-repo-url> bluestone-apps
cd bluestone-apps
```

## 5. Configure Environment Variables

### Multi-Site Manager (Backend API)

```bash
cd multi_site_manager

# Copy the example environment file
cp .env.example .env

# Edit the .env file
nano .env
```

Configure the following variables in `.env`:

```env
# Server Configuration
NODE_ENV=production
PORT=3000
API_BASE_URL=http://localhost:3000

# Database Configuration (matches docker-compose.yml)
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=multi_site_manager

# JWT Configuration
JWT_SECRET=<generate-a-strong-random-secret>
JWT_ACCESS_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d

# Email Configuration (for user verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<generate-a-strong-password>
```

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Admin Portal (Frontend)

```bash
cd ../admin_portal

# Create .env.local file
nano .env.local
```

Add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 6. Start Docker Services

```bash
# Return to project root
cd /opt/bluestone-apps

# Start all services
./start.sh

# Or manually with docker-compose:
docker-compose up -d
```

This will start:
- MySQL database (port 3306)
- phpMyAdmin (port 8080)
- Multi-Site Manager API (port 3000)
- Admin Portal (port 3001)

## 7. Initialize the Database

```bash
# Wait for MySQL to be ready (about 30 seconds)
sleep 30

# Run database migrations
cd multi_site_manager
docker-compose exec multi_site_manager npm run migrate

# Or manually import SQL files:
docker-compose exec -T mysql mysql -uroot -prootpassword multi_site_manager < ../phpmyadmin/schema.sql
docker-compose exec -T mysql mysql -uroot -prootpassword multi_site_manager < ../phpmyadmin/screen_elements_schema.sql
docker-compose exec -T mysql mysql -uroot -prootpassword multi_site_manager < src/migrations/001_create_mobile_app_users.sql
```

## 8. Create Initial Admin User

```bash
# Import the test user SQL (or create your own admin)
docker-compose exec -T mysql mysql -uroot -prootpassword multi_site_manager < CREATE_TEST_USER.sql

# Or manually create via phpMyAdmin at http://your-server-ip:8080
```

## 9. Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # API (or use reverse proxy)
sudo ufw allow 3001/tcp  # Admin Portal (or use reverse proxy)
sudo ufw allow 8080/tcp  # phpMyAdmin (optional, can be restricted)

# Enable firewall
sudo ufw enable
```

## 10. Set Up Nginx Reverse Proxy (Recommended for Production)

```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration file
sudo nano /etc/nginx/sites-available/bluestone-apps
```

Add the following configuration:

```nginx
# API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Admin Portal
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# phpMyAdmin (optional, restrict access)
server {
    listen 80;
    server_name db.yourdomain.com;

    # Restrict to specific IPs
    allow YOUR_IP_ADDRESS;
    deny all;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/bluestone-apps /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 11. Set Up SSL with Let's Encrypt (Production)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com -d db.yourdomain.com

# Certbot will automatically configure Nginx for HTTPS
# Certificates will auto-renew
```

## 12. Set Up System Services (Auto-start on Boot)

Create systemd service files to ensure services start on boot:

```bash
# Create service file for the application
sudo nano /etc/systemd/system/bluestone-apps.service
```

Add:

```ini
[Unit]
Description=Bluestone Apps Docker Services
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/bluestone-apps
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable bluestone-apps.service
```

## 13. Verify Installation

```bash
# Check if all containers are running
docker-compose ps

# Check API health
curl http://localhost:3000/health

# Check logs
docker-compose logs -f multi_site_manager
docker-compose logs -f admin_portal
```

Access the applications:
- **Admin Portal**: http://your-server-ip:3001 (or https://admin.yourdomain.com)
- **API**: http://your-server-ip:3000 (or https://api.yourdomain.com)
- **phpMyAdmin**: http://your-server-ip:8080 (or https://db.yourdomain.com)

## 14. Maintenance Commands

```bash
# View logs
docker-compose logs -f

# Restart services
./stop.sh && ./start.sh

# Update application
git pull
docker-compose down
docker-compose build
docker-compose up -d

# Backup database
docker-compose exec mysql mysqldump -uroot -prootpassword multi_site_manager > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T mysql mysql -uroot -prootpassword multi_site_manager < backup_20231106.sql
```

## 15. Security Hardening

### Restrict phpMyAdmin Access

Edit `docker-compose.yml` to bind phpMyAdmin to localhost only:

```yaml
phpmyadmin:
  ports:
    - "127.0.0.1:8080:80"  # Only accessible via localhost
```

### Change Default Database Password

1. Update `docker-compose.yml` MySQL password
2. Update `multi_site_manager/.env` DB_PASSWORD
3. Recreate containers: `docker-compose down && docker-compose up -d`

### Enable Docker Security

```bash
# Run Docker in rootless mode (optional, advanced)
# See: https://docs.docker.com/engine/security/rootless/
```

### Regular Updates

```bash
# Set up automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## Troubleshooting

### Services won't start
```bash
# Check Docker logs
docker-compose logs

# Check if ports are in use
sudo netstat -tulpn | grep -E '3000|3001|3306|8080'
```

### Database connection errors
```bash
# Verify MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Test connection
docker-compose exec mysql mysql -uroot -prootpassword -e "SHOW DATABASES;"
```

### Permission errors
```bash
# Fix ownership
sudo chown -R $USER:$USER /opt/bluestone-apps

# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

### Out of memory
```bash
# Check system resources
free -h
df -h

# Increase swap if needed
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Production Checklist

- [ ] Change all default passwords
- [ ] Configure proper SMTP settings
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Configure monitoring (e.g., PM2, Prometheus)
- [ ] Set up log rotation
- [ ] Restrict phpMyAdmin access
- [ ] Enable automatic security updates
- [ ] Configure domain DNS records
- [ ] Test disaster recovery procedures

## Support

For issues and questions, refer to:
- `README.md` - Project overview
- `HOW_TO_RESUME.md` - Development workflow
- `MOBILE_API.md` - API documentation
- `DATABASE_DOCUMENTATION.md` - Database schema

---

**Last Updated**: November 2025
