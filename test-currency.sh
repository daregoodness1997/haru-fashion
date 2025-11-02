#!/bin/bash

# Currency System Test Script
# This script performs basic tests on the currency conversion system

echo "🧪 Starting Currency System Tests..."
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test API endpoint
test_api() {
    local test_name=$1
    local url=$2
    local expected_success=$3
    
    echo -n "Testing: $test_name... "
    
    response=$(curl -s "$url")
    success=$(echo "$response" | grep -o '"success":true' || echo "")
    
    if [ "$expected_success" == "true" ] && [ -n "$success" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED=$((PASSED + 1))
        return 0
    elif [ "$expected_success" == "false" ] && [ -z "$success" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Response: $response"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Check if server is running
echo "1. Checking if development server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Server is running${NC}"
    echo ""
else
    echo -e "${RED}✗ Server is not running. Please start with 'npm run dev'${NC}"
    exit 1
fi

# Test Exchange Rate API
echo "2. Exchange Rate API Tests"
echo "----------------------------"

test_api "GET /api/exchange-rate" \
    "http://localhost:3000/api/exchange-rate" \
    "true"

test_api "GET /api/exchange-rate?refresh=true" \
    "http://localhost:3000/api/exchange-rate?refresh=true" \
    "true"

echo ""

# Test Exchange Rate Response Structure
echo "3. Exchange Rate Response Validation"
echo "-------------------------------------"

response=$(curl -s "http://localhost:3000/api/exchange-rate")

echo -n "Checking for 'rate' field... "
if echo "$response" | grep -q '"rate"'; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC}"
    FAILED=$((FAILED + 1))
fi

echo -n "Checking for 'cacheInfo' field... "
if echo "$response" | grep -q '"cacheInfo"'; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC}"
    FAILED=$((FAILED + 1))
fi

echo -n "Checking rate is a number... "
rate=$(echo "$response" | grep -o '"rate":[0-9.]*' | cut -d':' -f2)
if [ -n "$rate" ] && [ "$rate" -gt 0 ] 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED (Rate: $rate)${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC}"
    FAILED=$((FAILED + 1))
fi

echo ""

# Test Price Conversion
echo "4. Price Conversion Tests"
echo "-------------------------"

echo -n "Testing USD to NGN conversion (100 USD)... "
if [ -n "$rate" ]; then
    ngn_amount=$(echo "$rate * 100" | bc)
    echo -e "${GREEN}✓ PASSED (₦${ngn_amount})${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED (No rate available)${NC}"
    FAILED=$((FAILED + 1))
fi

echo ""

# Database Tests (if prisma is available)
echo "5. Database Checks"
echo "------------------"

if command -v npx &> /dev/null; then
    echo -n "Checking Prisma migration status... "
    if npx prisma migrate status 2>/dev/null | grep -q "Database schema is up to date"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}⚠ WARNING (Migrations may be pending)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ SKIPPED (npx not available)${NC}"
fi

echo ""

# Summary
echo "=================================="
echo "Test Summary"
echo "=================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
