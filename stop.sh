#!/bin/bash

echo "🛑 Stopping Bluestone Apps Master System..."
echo ""

# Stop all services
docker-compose down

echo ""
echo "✅ All services stopped"
echo ""
echo "To start again, run: ./start.sh"
echo ""
