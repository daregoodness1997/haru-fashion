#!/bin/bash

# Test Order Status Update
# Usage: ./test-order-status.sh <orderId> <status> [trackingNumber]

ORDER_ID=${1:-1}
STATUS=${2:-"processing"}
TRACKING=${3:-""}

echo "🧪 Testing Order Status Update..."
echo "Order ID: $ORDER_ID"
echo "New Status: $STATUS"
if [ ! -z "$TRACKING" ]; then
  echo "Tracking Number: $TRACKING"
fi
echo ""

# Build request body
if [ ! -z "$TRACKING" ]; then
  BODY="{\"status\": \"$STATUS\", \"trackingNumber\": \"$TRACKING\"}"
else
  BODY="{\"status\": \"$STATUS\"}"
fi

echo "Request body: $BODY"
echo ""

# Make the API call
curl -X PATCH "http://localhost:3000/api/v1/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -d "$BODY" \
  | jq

echo ""
echo "✅ Check your terminal running 'npm run dev' for log messages"
echo "✅ Check the customer's email inbox for the notification"
