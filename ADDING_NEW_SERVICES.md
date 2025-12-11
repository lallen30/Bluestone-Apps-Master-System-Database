# Adding New Services to Docker Compose

## Quick Guide

When you want to add a new service (e.g., email-service, sms-service, etc.), follow this template:

### 1. Create Service Directory

```bash
mkdir -p services/email_service/src
cd services/email_service
```

### 2. Create Service Files

Create your service with:

- `package.json` - Dependencies
- `src/index.js` - Main service file
- `src/bodyguard.js` - Bodyguard registration (copy from stripe_service)
- `src/routes/schema.js` - Schema endpoints
- `.env.example` - Environment template

### 3. Create Dockerfile

```dockerfile
# services/email_service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Expose port
EXPOSE 4002

# Start the service
CMD ["node", "src/index.js"]
```

### 4. Add to docker-compose.yml

Add this block after the last service:

```yaml
# Email Service
email_service:
  build:
    context: ./services/email_service
    dockerfile: Dockerfile
  container_name: email_service
  restart: unless-stopped
  ports:
    - "4002:4002"
  environment:
    NODE_ENV: development
    SERVICE_ID: email-service-1
    SERVICE_NAME: email-service
    SERVICE_PORT: 4002
    SERVICE_URL: http://email_service:4002
    BODYGUARD_URL: http://bodyguard:3032
    JWT_SECRET: dev-secret-key-change-in-production
    CORS_ORIGIN: "*"
    # Service-specific environment variables
    SENDGRID_API_KEY: ${SENDGRID_API_KEY:-default}
    FROM_EMAIL: ${FROM_EMAIL:-noreply@example.com}
  volumes:
    - ./services/email_service/src:/app/src
    - /app/node_modules
  networks:
    - app_network
  depends_on:
    bodyguard:
      condition: service_healthy
```

### 5. Update start.sh (Optional)

Add health check in start.sh:

```bash
# Check Email Service
if docker ps | grep -q email_service; then
  echo "✅ Email Service: Running on http://localhost:4002"
  if curl -s http://localhost:4002/health > /dev/null 2>&1; then
    echo "   Email Service Health: OK"
  else
    echo "   Email Service Health: Waiting..."
  fi
else
  echo "❌ Email Service: Not running"
fi
```

And update access points:

```bash
echo "   - Email Service: http://localhost:4002"
```

### 6. Start the Service

```bash
# Rebuild and start
docker-compose up -d --build

# Or just start the new service
docker-compose up -d email_service

# View logs
docker-compose logs -f email_service
```

## Port Allocation

Keep track of ports to avoid conflicts:

- **3000**: Multi-Site Manager API
- **3001**: Admin Portal
- **3032**: Bluestone Bodyguard
- **3306**: MySQL
- **4001**: Stripe Service
- **4002**: Email Service (next available)
- **4003**: SMS Service (next available)
- **4004**: Storage Service (next available)
- **8080**: phpMyAdmin

## Service Template Structure

Every service should have:

```
services/your_service/
├── Dockerfile
├── package.json
├── .env.example
└── src/
    ├── index.js              # Main entry point
    ├── bodyguard.js          # Bodyguard client
    ├── config/
    │   └── keys.js           # Key management (if needed)
    ├── middleware/
    │   └── auth.js           # JWT auth
    └── routes/
        ├── schema.js         # Schema endpoints (required)
        └── service.js        # Service-specific routes
```

## Required Endpoints

Every service MUST implement these 4 endpoints:

### 1. GET/POST /service/getSchema

Returns configuration schema:

```json
{
  "fields": [
    {
      "name": "apiKey",
      "label": "API Key",
      "type": "password",
      "required": true,
      "description": "Your service API key"
    }
  ],
  "capabilities": ["Send Email", "Templates"]
}
```

### 2. POST /service/getConfig

Returns current config for an app:

```json
{
  "appId": "1",
  "configured": true,
  "hasCustomKeys": true
}
```

### 3. POST /service/updateConfig

Updates configuration:

```json
{
  "appId": "1",
  "config": {
    "apiKey": "...",
    "fromEmail": "..."
  }
}
```

### 4. POST /service/testConnection

Tests if configuration works:

```json
{
  "appId": "1"
}
```

## Environment Variables

Standard environment variables for all services:

```env
# Service Identity
SERVICE_ID=your-service-1
SERVICE_NAME=your-service
SERVICE_PORT=4002
SERVICE_URL=http://your_service:4002

# Gateway
BODYGUARD_URL=http://bodyguard:3032

# Authentication
JWT_SECRET=dev-secret-key-change-in-production

# CORS
CORS_ORIGIN=*

# Service-specific variables
YOUR_API_KEY=${YOUR_API_KEY:-default}
```

## Docker Compose Service Template

Copy this template and customize:

```yaml
# Your Service Name
your_service:
  build:
    context: ./services/your_service
    dockerfile: Dockerfile
  container_name: your_service
  restart: unless-stopped
  ports:
    - "PORT:PORT" # Change PORT
  environment:
    NODE_ENV: development
    SERVICE_ID: your-service-1
    SERVICE_NAME: your-service
    SERVICE_PORT: PORT
    SERVICE_URL: http://your_service:PORT
    BODYGUARD_URL: http://bodyguard:3032
    JWT_SECRET: dev-secret-key-change-in-production
    CORS_ORIGIN: "*"
    # Add your service-specific env vars here
    YOUR_API_KEY: ${YOUR_API_KEY:-default}
  volumes:
    - ./services/your_service/src:/app/src
    - /app/node_modules
  networks:
    - app_network
  depends_on:
    bodyguard:
      condition: service_healthy
```

## Testing Your Service

### 1. Check if it's running

```bash
docker ps | grep your_service
```

### 2. Check logs

```bash
docker-compose logs -f your_service
```

### 3. Test health endpoint

```bash
curl http://localhost:PORT/health
```

### 4. Check Bodyguard registration

```bash
curl http://localhost:3032/services
```

### 5. Test schema endpoint

```bash
curl -X POST http://localhost:PORT/service/getSchema
```

## Troubleshooting

### Service won't start

```bash
# Check logs
docker-compose logs your_service

# Rebuild
docker-compose up -d --build your_service

# Check if port is in use
lsof -i :PORT
```

### Service not registering with Bodyguard

```bash
# Check Bodyguard is running
curl http://localhost:3032/health

# Check service logs for registration errors
docker-compose logs your_service | grep -i register

# Check network connectivity
docker-compose exec your_service ping bodyguard
```

### Can't connect from admin portal

```bash
# Check all services are on same network
docker network inspect bluestoneappsmastersystem_app_network

# Check Bodyguard can reach service
docker-compose exec bodyguard curl http://your_service:PORT/health
```

## Example: Adding Email Service

Here's a complete example of adding an email service:

### 1. Create service

```bash
mkdir -p services/email_service/src
cd services/email_service
npm init -y
npm install express dotenv axios nodemailer
```

### 2. Create Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 4002
CMD ["node", "src/index.js"]
```

### 3. Add to docker-compose.yml

```yaml
email_service:
  build:
    context: ./services/email_service
    dockerfile: Dockerfile
  container_name: email_service
  restart: unless-stopped
  ports:
    - "4002:4002"
  environment:
    NODE_ENV: development
    SERVICE_ID: email-service-1
    SERVICE_NAME: email-service
    SERVICE_PORT: 4002
    SERVICE_URL: http://email_service:4002
    BODYGUARD_URL: http://bodyguard:3032
    JWT_SECRET: dev-secret-key-change-in-production
    SMTP_HOST: ${SMTP_HOST:-smtp.gmail.com}
    SMTP_PORT: ${SMTP_PORT:-587}
    SMTP_USER: ${SMTP_USER:-}
    SMTP_PASS: ${SMTP_PASS:-}
  volumes:
    - ./services/email_service/src:/app/src
    - /app/node_modules
  networks:
    - app_network
  depends_on:
    bodyguard:
      condition: service_healthy
```

### 4. Start it

```bash
docker-compose up -d --build email_service
```

### 5. Check it

```bash
# View logs
docker-compose logs -f email_service

# Test health
curl http://localhost:4002/health

# Check registration
curl http://localhost:3032/services
```

Done! The service will automatically appear in the admin portal's integrations page.

## Best Practices

1. **Always use health checks** - Helps Docker know when service is ready
2. **Use volume mounts for development** - Hot reload during development
3. **Use environment variables** - Never hardcode secrets
4. **Follow the port convention** - Start at 4001 and increment
5. **Implement all 4 schema endpoints** - Required for admin portal integration
6. **Add proper logging** - Use console.log or a logging library
7. **Handle errors gracefully** - Return proper HTTP status codes
8. **Test locally first** - Make sure it works before adding to Docker
9. **Document your service** - Add README.md with setup instructions
10. **Use semantic versioning** - Track service versions properly

## Next Steps

After adding your service:

1. Test it works standalone
2. Test it registers with Bodyguard
3. Test it appears in admin portal
4. Test configuration through admin portal
5. Test the actual service functionality
6. Document any special setup requirements
7. Add to team documentation
