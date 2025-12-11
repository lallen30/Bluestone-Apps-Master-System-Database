#!/bin/bash

echo "Testing Settings Page Flow..."
echo ""

echo "1. Check if stripe-service is enabled for app 56:"
docker exec -i multi_app_mysql mysql -uroot -prootpassword multi_site_manager -e "SELECT * FROM app_services WHERE app_id = 56;" 2>/dev/null | tail -n +2
echo ""

echo "2. Check Bodyguard services:"
curl -s http://localhost:3032/services | jq '.services[].name'
echo ""

echo "3. Test schema endpoint directly:"
curl -s -X POST http://localhost:4001/service/getSchema | jq '.success, .fields | length'
echo ""

echo "4. Test through Bodyguard (this is what admin portal does):"
curl -s -X POST http://localhost:3032/stripe-service/service/getSchema | jq '.'
echo ""
