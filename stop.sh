#!/bin/bash

echo "🛑 Stopping Bluestone Apps Master System..."
echo ""

# Stop Bluestone Bodyguard (native)
if [ -f .bodyguard.pid ]; then
  BODYGUARD_PID=$(cat .bodyguard.pid)
  if ps -p $BODYGUARD_PID > /dev/null 2>&1; then
    echo "🛑 Stopping Bluestone Bodyguard (PID: $BODYGUARD_PID)..."
    kill $BODYGUARD_PID
    rm .bodyguard.pid
  fi
fi

# Stop all Docker services
docker-compose down

echo ""
echo "✅ All services stopped"
echo ""
echo "To start again, run: ./start.sh"
echo "To remove volumes: docker-compose down -v"
echo ""
