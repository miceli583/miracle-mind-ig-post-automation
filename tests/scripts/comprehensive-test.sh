#!/bin/bash

# Comprehensive Test Suite for Instagram Post Automation
# Runs all automated tests and organizes outputs

set -e  # Exit on any error

# Configuration
API_URL="http://localhost:3001/api/generate-image"
TEST_OUTPUT_DIR="tests/outputs"
SCRIPTS_DIR="tests/scripts"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_TESTS++))
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++))
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if server is running
check_server() {
    log_info "Checking if server is running..."
    if curl -s "$API_URL" > /dev/null 2>&1; then
        log_error "Server check failed. Please start the server with 'npm run dev'"
        exit 1
    fi
    log_success "Server is running"
}

# Test function that makes API call and validates response
run_test() {
    local test_name="$1"
    local json_data="$2"
    local output_file="$3"
    local expected_status="$4"
    
    ((TOTAL_TESTS++))
    
    log_info "Running: $test_name"
    
    # Make the API call
    local response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "$json_data" \
        --output "$output_file" 2>/dev/null)
    
    # Extract HTTP status
    local http_status=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    
    # Validate response
    if [ "$http_status" = "$expected_status" ]; then
        if [ "$expected_status" = "200" ] && [ -f "$output_file" ]; then
            local file_size=$(ls -lah "$output_file" | awk '{print $5}')
            log_success "$test_name - Status: $http_status, Size: $file_size"
        else
            log_success "$test_name - Status: $http_status (validation error as expected)"
            rm -f "$output_file" 2>/dev/null
        fi
    else
        log_error "$test_name - Expected: $expected_status, Got: $http_status"
    fi
}

# Clear previous test outputs
clear_test_outputs() {
    log_info "Clearing previous test outputs..."
    find "$TEST_OUTPUT_DIR" -name "*.png" -delete 2>/dev/null || true
    log_success "Test outputs cleared"
}

# Main test execution
main() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "   Instagram Post Automation - Test Suite"
    echo "=================================================="
    echo -e "${NC}"
    
    # Create output directories if they don't exist
    mkdir -p "$TEST_OUTPUT_DIR"/{basic-functionality,validation,font-sizing,special-characters,performance,edge-cases}
    
    # Clear previous outputs
    clear_test_outputs
    
    # Check server
    check_server
    
    echo -e "\n${YELLOW}=== BASIC FUNCTIONALITY TESTS ===${NC}"
    
    run_test "Valid request with all fields" \
        '{"coreValue": "Love", "supportingValue": "COMPASSION", "quote": "Be kind to yourself", "author": "Buddha"}' \
        "$TEST_OUTPUT_DIR/basic-functionality/test-valid-full.png" \
        "200"
    
    run_test "Valid request without author" \
        '{"coreValue": "Peace", "supportingValue": "MINDFULNESS", "quote": "Inner peace begins with acceptance"}' \
        "$TEST_OUTPUT_DIR/basic-functionality/test-valid-no-author.png" \
        "200"
    
    run_test "Minimum length fields" \
        '{"coreValue": "A", "supportingValue": "B", "quote": "Short test quote"}' \
        "$TEST_OUTPUT_DIR/basic-functionality/test-min-length.png" \
        "200"
    
    echo -e "\n${YELLOW}=== INPUT VALIDATION TESTS ===${NC}"
    
    run_test "Missing required field" \
        '{"coreValue": "Love", "supportingValue": "COMPASSION"}' \
        "$TEST_OUTPUT_DIR/validation/test-missing-field.png" \
        "400"
    
    run_test "Empty JSON" \
        '{}' \
        "$TEST_OUTPUT_DIR/validation/test-empty-json.png" \
        "400"
    
    run_test "Core Value too long" \
        '{"coreValue": "'$(printf 'A%.0s' {1..81})'", "supportingValue": "TEST", "quote": "This should fail"}' \
        "$TEST_OUTPUT_DIR/validation/test-too-long.png" \
        "400"
    
    echo -e "\n${YELLOW}=== DYNAMIC FONT SIZING TESTS ===${NC}"
    
    run_test "Short text (largest fonts)" \
        '{"coreValue": "Love", "supportingValue": "JOY", "quote": "Be happy today", "author": "Me"}' \
        "$TEST_OUTPUT_DIR/font-sizing/test-short-text.png" \
        "200"
    
    run_test "Medium text" \
        '{"coreValue": "Unconditional Love", "supportingValue": "TRANSFORMATIONAL HEALING", "quote": "The greatest revolution of our generation is the discovery that human beings can alter their lives", "author": "William James"}' \
        "$TEST_OUTPUT_DIR/font-sizing/test-medium-text.png" \
        "200"
    
    run_test "Long text (smallest fonts)" \
        '{"coreValue": "Transformational Spiritual Growth Through Mindful Living", "supportingValue": "DEEP HEALING WISDOM THROUGH CONTEMPLATIVE PRACTICES", "quote": "The most beautiful people we have known are those who have known defeat, known suffering, known struggle, known loss, and have found their way out of the depths. These persons have an appreciation, a sensitivity, and an understanding of life that fills them with compassion, gentleness, and a deep loving concern.", "author": "Elisabeth Kübler-Ross"}' \
        "$TEST_OUTPUT_DIR/font-sizing/test-long-text.png" \
        "200"
    
    echo -e "\n${YELLOW}=== SPECIAL CHARACTERS TESTS ===${NC}"
    
    run_test "Unicode characters" \
        '{"coreValue": "Liebe ❤️", "supportingValue": "ÑOÑO", "quote": "Être ou ne pas être, telle est la question", "author": "Shakespearé"}' \
        "$TEST_OUTPUT_DIR/special-characters/test-unicode.png" \
        "200"
    
    run_test "Quotes and punctuation" \
        '{"coreValue": "\"Truth\"", "supportingValue": "WISDOM & LIGHT", "quote": "Life'\''s most persistent question is: \"What are you doing for others?\"", "author": "Dr. King Jr."}' \
        "$TEST_OUTPUT_DIR/special-characters/test-quotes.png" \
        "200"
    
    run_test "HTML/XSS security test" \
        '{"coreValue": "<script>alert(\"xss\")</script>", "supportingValue": "&lt;LOVE&gt;", "quote": "Test &amp; validation with HTML entities", "author": "Security"}' \
        "$TEST_OUTPUT_DIR/special-characters/test-security.png" \
        "200"
    
    echo -e "\n${YELLOW}=== PERFORMANCE TESTS ===${NC}"
    
    log_info "Running single request performance test..."
    ((TOTAL_TESTS++))
    start_time=$(date +%s.%N)
    run_test "Performance test" \
        '{"coreValue": "Speed Test", "supportingValue": "PERFORMANCE", "quote": "How fast can this generate an image?"}' \
        "$TEST_OUTPUT_DIR/performance/test-speed.png" \
        "200"
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc -l)
    log_info "Single request took: ${duration}s"
    
    echo -e "\n${YELLOW}=== CONCURRENT LOAD TEST ===${NC}"
    log_info "Running 5 concurrent requests..."
    
    for i in {1..5}; do
        curl -s -X POST "$API_URL" \
            -H "Content-Type: application/json" \
            -d '{"coreValue": "Concurrent '$i'", "supportingValue": "LOAD TEST", "quote": "Testing concurrent request handling for automation"}' \
            --output "$TEST_OUTPUT_DIR/performance/test-concurrent-$i.png" &
    done
    wait
    
    # Count successful concurrent requests
    concurrent_count=$(ls "$TEST_OUTPUT_DIR/performance/test-concurrent-"*.png 2>/dev/null | wc -l | tr -d ' ')
    if [ "$concurrent_count" = "5" ]; then
        log_success "Concurrent test - All 5 requests completed successfully"
        ((PASSED_TESTS++))
    else
        log_error "Concurrent test - Only $concurrent_count/5 requests completed"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Generate test report
    generate_report
}

generate_report() {
    echo -e "\n${BLUE}=================================================="
    echo "                 TEST SUMMARY"
    echo -e "==================================================${NC}"
    
    echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "\n${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
        echo -e "${GREEN}Your Instagram automation is ready for production!${NC}"
    else
        echo -e "\n${RED}❌ SOME TESTS FAILED${NC}"
        echo -e "${RED}Please review the failures above${NC}"
        exit 1
    fi
    
    echo -e "\n${BLUE}Test outputs organized in:${NC}"
    echo "📁 tests/outputs/"
    find "$TEST_OUTPUT_DIR" -name "*.png" | sort | sed 's/^/   /'
    
    # Calculate total size
    total_size=$(find "$TEST_OUTPUT_DIR" -name "*.png" -exec ls -l {} \; | awk '{sum += $5} END {print sum}')
    if [ -n "$total_size" ]; then
        total_size_mb=$(echo "scale=2; $total_size / 1024 / 1024" | bc -l)
        echo -e "\n${BLUE}Total test assets size: ${total_size_mb}MB${NC}"
    fi
}

# Run main function
main "$@"