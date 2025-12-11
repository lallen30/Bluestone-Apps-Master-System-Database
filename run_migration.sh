#!/bin/bash

echo "🔧 Running database migrations..."

# Check if MySQL container is running
if ! docker ps | grep -q multi_app_mysql; then
  echo "❌ MySQL container is not running. Please start the system first with ./start.sh"
  exit 1
fi

CONTAINER_NAME=multi_app_mysql
DB_NAME=multi_site_manager
MYSQL_USER=root
MYSQL_PASS=rootpassword

run_sql_file() {
  local file="$1"
  echo "➡️ Applying $file"
  docker exec -i "$CONTAINER_NAME" mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$DB_NAME" < "$file"
  if [ $? -ne 0 ]; then
    echo "❌ Failed to apply $file"
    exit 1
  fi
}

# Keep existing legacy migration if present
LEGACY_FILE="multi_site_manager/migrations/create_app_services.sql"
if [ -f "$LEGACY_FILE" ]; then
  run_sql_file "$LEGACY_FILE"
fi

# Apply any migrations in src/migrations (sorted)
MIG_DIR="multi_site_manager/src/migrations"
if [ -d "$MIG_DIR" ]; then
  for f in $(ls "$MIG_DIR"/*.sql 2>/dev/null | sort); do
    [ -f "$f" ] || continue
    run_sql_file "$f"
  done
fi

echo "✅ All migrations applied successfully."
