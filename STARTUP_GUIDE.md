# Startup Guide

## Quick Start

### 1. Start Everything

```bash
./start.sh
```

This will start:

- ✅ MySQL Database (Docker)
- ✅ phpMyAdmin (Docker)
- ✅ Multi-Site Manager API (Docker)
- ✅ Admin Portal (Docker)
- ✅ Bluestone Bodyguard (Native - Rust)
- ✅ Stripe Service (Native - Node.js)

### 2. Stop Everything

```bash
./stop.sh
```

This stops all services including Docker containers and native processes.

## What Gets Started

### Docker Services (Port 3000-3001, 8080)

- **MySQL Database**: Port 3306
- **phpMyAdmin**: http://localhost:8080
- **Multi-Site Manager API**: http://localhost:3000
- **Admin Portal**: http://localhost:3001

### Native Services (Port 3032, 4001+)

- **Bluestone Bodyguard**: http://localhost:3032 (Rust)
- **Stripe Service**: http://localhost:4001 (Node.js)

## Service Logs

All native services log to the `logs/` directory:

```bash
# View Bodyguard logs
tail -f logs/bodyguard.log

# View Stripe Service logs
tail -f logs/stripe_service.log
```

## Process Management

The script creates PID files to track native processes:

- `.bodyguard.pid` - Bluestone Bodyguard process ID
- `.stripe_service.pid` - Stripe Service process ID

These are automatically cleaned up when you run `./stop.sh`.

## Prerequisites

### For Docker Services

- Docker Desktop running
- Ports 3000, 3001, 3306, 8080 available

### For Bluestone Bodyguard

- Rust and Cargo installed
- Port 3032 available

### For Stripe Service

- Node.js and npm installed
- Dependencies installed: `cd services/stripe_service && npm install`
- `.env` file configured (copy from `.env.example`)
- Port 4001 available

## First Time Setup

### 1. Install Dependencies

```bash
# Stripe Service
cd services/stripe_service
npm install
cp .env.example .env
# Edit .env with your configuration
cd ../..
```

### 2. Run Database Migration

```bash
# Create app_services table
mysql -u root -p your_database < multi_site_manager/migrations/create_app_services.sql
```

### 3. Start System

```bash
./start.sh
```

## Access Points

After starting, you can access:

- **Admin Portal**: http://localhost:3001

  - Email: `master@example.com`
  - Password: `password123`

- **API**: http://localhost:3000

  - Health: http://localhost:3000/health

- **phpMyAdmin**: http://localhost:8080

  - Server: `mysql_db`
  - Username: `root`
  - Password: `rootpassword`

- **Bluestone Bodyguard**: http://localhost:3032

  - Health: http://localhost:3032/health
  - Services: http://localhost:3032/services

- **Stripe Service**: http://localhost:4001
  - Health: http://localhost:4001/health

## Troubleshooting

### Service Won't Start

**Docker services:**

```bash
# Check Docker is running
docker info

# View logs
docker-compose logs -f
```

**Bodyguard:**

```bash
# Check if Rust is installed
cargo --version

# Check logs
tail -f logs/bodyguard.log

# Check if port is in use
lsof -i :3032
```

**Stripe Service:**

```bash
# Check if Node.js is installed
node --version

# Check dependencies
cd services/stripe_service
npm install

# Check .env file exists
ls -la .env

# Check logs
tail -f logs/stripe_service.log

# Check if port is in use
lsof -i :4001
```

### Port Already in Use

If a port is already in use:

```bash
# Find process using port
lsof -i :PORT_NUMBER

# Kill the process
kill -9 PID
```

### Services Not Communicating

1. Check all services are running:

```bash
# Check Docker
docker ps

# Check Bodyguard
curl http://localhost:3032/health

# Check Stripe Service
curl http://localhost:4001/health
```

2. Check Bodyguard has services registered:

```bash
curl http://localhost:3032/services
```

3. Check logs for errors:

```bash
tail -f logs/bodyguard.log
tail -f logs/stripe_service.log
docker-compose logs -f
```

### Clean Restart

If things aren't working, try a clean restart:

```bash
# Stop everything
./stop.sh

# Clean up any stray processes
pkill -f "cargo run"
pkill -f "npm run dev"

# Remove PID files
rm -f .*.pid

# Start fresh
./start.sh
```

## Development Workflow

### Working on Bodyguard

```bash
# Stop the auto-started version
kill $(cat .bodyguard.pid)

# Run manually for development
cd bluestone_bodyguard
cargo run
```

### Working on Stripe Service

```bash
# Stop the auto-started version
kill $(cat .stripe_service.pid)

# Run manually for development
cd services/stripe_service
npm run dev
```

### Working on Docker Services

```bash
# Restart a specific service
docker-compose restart api
docker-compose restart admin_portal

# View logs for a specific service
docker-compose logs -f api
```

## Adding More Services

When you add a new service (e.g., email-service):

1. Create the service in `services/` directory
2. Implement Bodyguard registration
3. Add to `start.sh`:

```bash
# Start Email Service
echo ""
echo "📧 Starting Email Service..."
cd services/email_service
npm run dev > ../../logs/email_service.log 2>&1 &
EMAIL_PID=$!
cd ../..
sleep 3

if ps -p $EMAIL_PID > /dev/null; then
  echo "✅ Email Service: Running on http://localhost:4002 (PID: $EMAIL_PID)"
  echo $EMAIL_PID > .email_service.pid
else
  echo "❌ Email Service: Failed to start"
fi
```

4. Add to `stop.sh`:

```bash
# Stop Email Service
if [ -f .email_service.pid ]; then
  EMAIL_PID=$(cat .email_service.pid)
  if ps -p $EMAIL_PID > /dev/null 2>&1; then
    echo "🛑 Stopping Email Service (PID: $EMAIL_PID)..."
    kill $EMAIL_PID
    rm .email_service.pid
  fi
fi
```

## Production Deployment

For production, you'll want to:

1. Use proper process managers:

   - **PM2** for Node.js services
   - **systemd** for Rust services
   - **Docker Compose** with restart policies

2. Set up proper logging:

   - Log rotation
   - Centralized logging (e.g., ELK stack)

3. Use environment-specific configs:

   - Production `.env` files
   - Secrets management (e.g., AWS Secrets Manager)

4. Set up monitoring:
   - Health checks
   - Alerts
   - Metrics (e.g., Prometheus + Grafana)

This startup script is designed for **development** use.
