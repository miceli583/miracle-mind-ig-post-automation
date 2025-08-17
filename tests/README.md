# Test Suite for Instagram Post Automation

This directory contains comprehensive tests for the Instagram post automation API.

## 📁 Directory Structure

```
tests/
├── README.md                    # This file
├── scripts/                     # Test scripts
│   ├── comprehensive-test.sh    # Full test suite
│   └── quick-test.sh           # Quick validation test
└── outputs/                    # Test image outputs (organized by category)
    ├── basic-functionality/    # Valid request tests
    ├── validation/             # Input validation tests  
    ├── font-sizing/           # Dynamic font scaling tests
    ├── special-characters/    # Unicode, HTML, security tests
    ├── performance/           # Speed and load tests
    └── edge-cases/           # Boundary and error cases
```

## 🚀 Running Tests

### Prerequisites
1. Start the development server:
   ```bash
   npm run dev
   ```

### Quick Test (2 tests, ~10 seconds)
```bash
./tests/scripts/quick-test.sh
```

### Comprehensive Test Suite (15+ tests, ~2 minutes)
```bash
./tests/scripts/comprehensive-test.sh
```

## 📊 Test Categories

### 1. Basic Functionality Tests
- ✅ Valid request with all fields
- ✅ Valid request without author
- ✅ Minimum length fields

### 2. Input Validation Tests
- ✅ Missing required fields → HTTP 400
- ✅ Empty JSON → HTTP 400
- ✅ Invalid JSON → HTTP 400
- ✅ Fields exceeding limits → HTTP 400

### 3. Dynamic Font Sizing Tests
- ✅ Short text (uses largest fonts)
- ✅ Medium text (uses medium fonts)
- ✅ Long text (uses smallest fonts)

### 4. Special Characters Tests
- ✅ Unicode characters (❤️, ñ, é)
- ✅ Quotes and punctuation
- ✅ HTML/XSS security (safely escaped)

### 5. Performance Tests
- ✅ Single request response time
- ✅ Concurrent request handling

### 6. Edge Cases
- ✅ Boundary value testing
- ✅ Error recovery

## 🎯 Expected Results

### Performance Benchmarks
- **Response Time**: 2-3 seconds per image
- **File Size Range**: 44KB - 203KB
- **Concurrent Handling**: 5+ simultaneous requests

### Font Scaling Validation
- **Short text**: ~50KB files (large fonts)
- **Medium text**: ~100KB files (medium fonts)  
- **Long text**: ~200KB files (small fonts)

## 🔍 Manual Inspection

After running tests, manually verify generated images for:
- ✅ Text fits within container boundaries
- ✅ Font sizes scale appropriately
- ✅ Colors match brand guidelines
- ✅ Dove icon appears (35px × 35px)
- ✅ Layout is properly centered
- ✅ Special characters render correctly

## 🛠️ Make.com Integration Testing

Test the exact format Make.com will use:

```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "coreValue": "Authenticity",
    "supportingValue": "EMBODIMENT",
    "quote": "In every encounter, we are either extending love or calling for love.",
    "author": "A Course in Miracles"
  }' --output make-integration-test.png
```

## 📝 Adding New Tests

To add new test cases:

1. **Add to comprehensive-test.sh**:
   ```bash
   run_test "Your test name" \
       '{"coreValue": "Test", "supportingValue": "DATA", "quote": "Your test quote"}' \
       "$TEST_OUTPUT_DIR/category/test-file.png" \
       "200"
   ```

2. **Create new category folder** if needed:
   ```bash
   mkdir -p tests/outputs/new-category
   ```

3. **Update this README** with new test descriptions

## 🐛 Troubleshooting

### Common Issues

**Server not running**:
```bash
npm run dev
```

**Permission denied**:
```bash
chmod +x tests/scripts/*.sh
```

**Port conflicts**:
- Tests expect server on port 3001
- Update `API_URL` in scripts if different

**Missing dependencies**:
```bash
npm install
```

## 📈 Continuous Integration

For CI/CD pipelines, use:

```bash
# Start server in background
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Run tests
./tests/scripts/comprehensive-test.sh

# Cleanup
kill $SERVER_PID
```

## 🎨 Test Asset Management

Generated test images are automatically organized by category. To clean up:

```bash
# Remove all test outputs
rm -rf tests/outputs/*/*.png

# Or remove specific category
rm -rf tests/outputs/performance/*.png
```

---

*This test suite ensures the Instagram automation is robust and ready for production use with Make.com integration.*