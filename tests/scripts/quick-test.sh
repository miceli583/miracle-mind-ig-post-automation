#!/bin/bash

# Quick Test - Basic functionality check
# Usage: ./quick-test.sh

API_URL="http://localhost:3001/api/generate-image"
OUTPUT_DIR="tests/outputs/quick-test"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Quick Test - Basic API Functionality${NC}"
echo "======================================"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Test 1: Basic valid request
echo -n "Testing basic request... "
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
    -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{"coreValue": "Love", "supportingValue": "PEACE", "quote": "Quick test quote for validation"}' \
    --output "$OUTPUT_DIR/quick-test.png" 2>/dev/null)

http_status=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)

if [ "$http_status" = "200" ] && [ -f "$OUTPUT_DIR/quick-test.png" ]; then
    file_size=$(ls -lah "$OUTPUT_DIR/quick-test.png" | awk '{print $5}')
    echo -e "${GREEN}PASS${NC} (Status: $http_status, Size: $file_size)"
else
    echo -e "${RED}FAIL${NC} (Status: $http_status)"
    exit 1
fi

# Test 2: Validation error
echo -n "Testing validation... "
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
    -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{"coreValue": "Missing quote"}' \
    --output /dev/null 2>/dev/null)

http_status=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)

if [ "$http_status" = "400" ]; then
    echo -e "${GREEN}PASS${NC} (Status: $http_status)"
else
    echo -e "${RED}FAIL${NC} (Status: $http_status)"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Quick test completed successfully!${NC}"
echo -e "Generated image: $OUTPUT_DIR/quick-test.png"