#!/bin/bash

echo "🚀 Starting Bluestone Apps Master System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start all services
echo "🐳 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

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

echo ""
echo "===================="
echo "🎉 System is ready!"
echo ""
echo "📝 Access Points:"
echo "   - Admin Portal: http://localhost:3001 (or http://knoxdev.org:3001)"
echo "   - API: http://localhost:3000 (or http://knoxdev.org:3000)"
echo "   - phpMyAdmin: http://localhost:8080 (or http://knoxdev.org:8080)"
echo ""
echo "🔐 Admin Portal Login:"
echo "   Email: admin@knoxweb.com"
echo "   Password: admin123"
echo ""
echo "🔐 phpMyAdmin Login:"
echo "   Server: mysql_db"
echo "   Username: root"
echo "   Password: rootpassword"
echo ""
echo "📋 Useful Commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop system: ./stop.sh"
echo "   - Restart: docker-compose restart"
echo ""
