#!/bin/bash

echo "🔧 Running database migration..."

# Check if MySQL container is running
if ! docker ps | grep -q multi_app_mysql; then
  echo "❌ MySQL container is not running. Please start the system first with ./start.sh"
  exit 1
fi

# Run the migration through Docker
docker exec -i multi_app_mysql mysql -uroot -prootpassword multi_site_manager < multi_site_manager/migrations/create_app_services.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo "   Table 'app_services' has been created."
else
  echo "❌ Migration failed!"
  exit 1
fi
