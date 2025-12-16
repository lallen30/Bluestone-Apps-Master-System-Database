#!/bin/bash

echo "🚀 Starting Bluestone Apps Master System..."
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Stop any existing processes on required ports
echo "🧹 Cleaning up existing processes..."

# Check and kill process on port 4001 (Stripe Service)
if lsof -ti:4001 > /dev/null 2>&1; then
  echo "   Killing process on port 4001..."
  kill -9 $(lsof -ti:4001) 2>/dev/null || true
fi

# Check and kill process on port 3032 (Bodyguard)
if lsof -ti:3032 > /dev/null 2>&1; then
  echo "   Killing process on port 3032..."
  kill -9 $(lsof -ti:3032) 2>/dev/null || true
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start all services
echo "🐳 Starting all services..."
docker-compose up -d

# Wait for Docker services to be ready
echo "⏳ Waiting for Docker services to start..."
sleep 10

echo ""
echo "🛡️  Starting Bluestone Bodyguard (in Docker via docker-compose)..."
# Pass host UID/GID to docker-compose using HOST_* vars so we don't touch
# the shell's readonly `UID` variable (zsh/builtin). Compose reads
# ${HOST_UID}/${HOST_GID} (see docker-compose.yml change).
HOST_UID=$(id -u)
HOST_GID=$(id -g)
# Build and start all services (rebuild to pick up local changes)
HOST_UID=${HOST_UID} HOST_GID=${HOST_GID} docker-compose up -d --build
sleep 3

# Check service health
echo ""
echo "📊 Service Status:"
echo "===================="

# Check MySQL
if docker ps | grep -q multi_app_mysql; then
  echo "✅ MySQL Database: Running on port 3306"
else
  echo "❌ MySQL Database: Not running"
fi

# Check phpMyAdmin
if docker ps | grep -q multi_app_phpmyadmin; then
  echo "✅ phpMyAdmin: Running on http://localhost:8080"
else
  echo "❌ phpMyAdmin: Not running"
fi

# Check API
if docker ps | grep -q multi_app_api; then
  echo "✅ API: Running on http://localhost:3000"
  # Test API health
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "   API Health: OK"
  else
    echo "   API Health: Waiting..."
  fi
else
  echo "❌ API: Not running"
fi

# Check Admin Portal
if docker ps | grep -q multi_app_admin_portal; then
  echo "✅ Admin Portal: Running on http://localhost:3001"
else
  echo "❌ Admin Portal: Not running"
fi

# Check Bluestone Bodyguard (docker)
if docker ps --filter "name=bodyguard" --filter "status=running" -q | grep -q .; then
  echo "✅ Bluestone Bodyguard: Running on http://localhost:3032"
  if curl -s http://localhost:3032/health > /dev/null 2>&1; then
    echo "   Bodyguard Health: OK"
  else
    echo "   Bodyguard Health: Waiting..."
  fi
else
  echo "❌ Bluestone Bodyguard: Not running"
fi

# Check Stripe Service
if docker ps | grep -q stripe_service; then
  echo "✅ Stripe Service: Running on http://localhost:4001"
  # Test Stripe Service health
  if curl -s http://localhost:4001/health > /dev/null 2>&1; then
    echo "   Stripe Service Health: OK"
  else
    echo "   Stripe Service Health: Waiting..."
  fi
else
  echo "❌ Stripe Service: Not running"
fi

echo ""
echo "===================="
echo "🎉 System is ready!"
echo ""
echo "📝 Access Points:"
echo "   - Admin Portal: http://localhost:3001"
echo "   - API: http://localhost:3000"
echo "   - phpMyAdmin: http://localhost:8080"
echo "   - Bluestone Bodyguard: http://localhost:3032"
echo "   - Stripe Service: http://localhost:4001"
echo ""
echo "🔐 Admin Portal Login:"
echo "   Email: master@example.com"
echo "   Password: password123"
echo ""
echo "🔐 phpMyAdmin Login:"
echo "   Server: mysql_db"
echo "   Username: root"
echo "   Password: rootpassword"
echo ""
echo "📋 Useful Commands:"
echo "   - View all logs: docker-compose logs -f"
echo "   - View specific service: docker-compose logs -f [service_name]"
echo "   - View Bodyguard logs: docker-compose logs -f bodyguard"
echo "   - Stop system: ./stop.sh"
echo "   - Restart: docker-compose restart"
echo "   - Rebuild: docker-compose up -d --build"
echo ""
