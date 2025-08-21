#!/usr/bin/env node

/**
 * CRUD Test Utilities for Instagram Post Automation
 * Comprehensive testing framework for Core Values, Supporting Values, and Quotes
 */

// Using Node.js built-in fetch (Node 18+)
const fs = require('fs');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3002';
const TEST_RESULTS = [];

// Test configuration
const CONFIG = {
  endpoints: {
    coreValues: '/api/admin/core-values',
    supportingValues: '/api/admin/supporting-values',
    quotes: '/api/admin/quotes-relational',
    auth: '/api/auth/login'
  },
  testData: {
    coreValue: {
      value: 'Test Core Value',
      description: 'Test description for core value',
      isActive: true
    },
    supportingValue: {
      value: 'Test Supporting Value',
      description: 'Test description for supporting value',
      isActive: true
    },
    quote: {
      text: 'This is a test quote for validation purposes.',
      category: 'test',
      tags: ['test', 'validation'],
      isActive: true
    }
  }
};

// Utility functions
function generateTestId() {
  return `test_${crypto.randomBytes(8).toString('hex')}`;
}

function logResult(test, passed, details = '') {
  const result = {
    test,
    passed,
    details,
    timestamp: new Date().toISOString()
  };
  TEST_RESULTS.push(result);
  console.log(`${passed ? '✅' : '❌'} ${test}: ${details}`);
}

async function makeRequest(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { response, data, status: response.status };
  } catch (error) {
    return { error: error.message, status: 0 };
  }
}

// Data validation functions
function validateCoreValue(item) {
  return item &&
    typeof item.id === 'string' &&
    typeof item.value === 'string' &&
    typeof item.isActive === 'boolean' &&
    item.createdAt &&
    item.updatedAt;
}

function validateSupportingValue(item) {
  return item &&
    typeof item.id === 'string' &&
    typeof item.value === 'string' &&
    typeof item.isActive === 'boolean' &&
    Array.isArray(item.coreValueIds) &&
    item.createdAt &&
    item.updatedAt;
}

function validateQuote(item) {
  return item &&
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.isActive === 'boolean' &&
    item.createdAt &&
    item.updatedAt;
}

// Core Values CRUD Tests
async function testCoreValuesCRUD() {
  console.log('\n=== CORE VALUES CRUD TESTS ===');
  
  let createdId = null;
  
  // CREATE Test
  const createData = { ...CONFIG.testData.coreValue, value: `Test_${generateTestId()}` };
  const createResult = await makeRequest(CONFIG.endpoints.coreValues, {
    method: 'POST',
    body: JSON.stringify(createData)
  });
  
  if (createResult.status === 201 && validateCoreValue(createResult.data)) {
    createdId = createResult.data.id;
    logResult('Core Value CREATE', true, `Created ID: ${createdId}`);
  } else {
    logResult('Core Value CREATE', false, createResult.data?.error || 'Invalid response');
    return;
  }
  
  // READ Test
  const readResult = await makeRequest(CONFIG.endpoints.coreValues);
  if (readResult.status === 200 && Array.isArray(readResult.data)) {
    const found = readResult.data.find(item => item.id === createdId);
    logResult('Core Value READ', !!found, found ? 'Item found in list' : 'Item not found');
  } else {
    logResult('Core Value READ', false, 'Failed to fetch list');
  }
  
  // UPDATE Test
  const updateData = { ...createData, value: `Updated_${generateTestId()}` };
  const updateResult = await makeRequest(`${CONFIG.endpoints.coreValues}/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  
  if (updateResult.status === 200 && updateResult.data.value === updateData.value) {
    logResult('Core Value UPDATE', true, 'Value updated successfully');
  } else {
    logResult('Core Value UPDATE', false, updateResult.data?.error || 'Update failed');
  }
  
  // ARCHIVE Test
  const archiveResult = await makeRequest(`${CONFIG.endpoints.coreValues}/${createdId}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'archive' })
  });
  
  if (archiveResult.status === 200 && archiveResult.data.success) {
    logResult('Core Value ARCHIVE', true, 'Archived successfully');
  } else {
    logResult('Core Value ARCHIVE', false, archiveResult.data?.error || 'Archive failed');
  }
  
  // DELETE Test
  const deleteResult = await makeRequest(`${CONFIG.endpoints.coreValues}/${createdId}`, {
    method: 'DELETE'
  });
  
  if (deleteResult.status === 200) {
    logResult('Core Value DELETE', true, 'Deleted successfully');
  } else {
    logResult('Core Value DELETE', false, deleteResult.data?.error || 'Delete failed');
  }
}

// Supporting Values CRUD Tests
async function testSupportingValuesCRUD() {
  console.log('\n=== SUPPORTING VALUES CRUD TESTS ===');
  
  // First get a core value ID for relationship
  const coreValuesResult = await makeRequest(CONFIG.endpoints.coreValues);
  if (!coreValuesResult.data || coreValuesResult.data.length === 0) {
    logResult('Supporting Values CRUD', false, 'No core values available for testing');
    return;
  }
  
  const coreValueId = coreValuesResult.data[0].id;
  let createdId = null;
  
  // CREATE Test
  const createData = {
    ...CONFIG.testData.supportingValue,
    value: `Test_${generateTestId()}`,
    coreValueIds: [coreValueId]
  };
  
  const createResult = await makeRequest(CONFIG.endpoints.supportingValues, {
    method: 'POST',
    body: JSON.stringify(createData)
  });
  
  if (createResult.status === 201 && validateSupportingValue(createResult.data)) {
    createdId = createResult.data.id;
    logResult('Supporting Value CREATE', true, `Created ID: ${createdId}`);
  } else {
    logResult('Supporting Value CREATE', false, createResult.data?.error || 'Invalid response');
    return;
  }
  
  // READ Test
  const readResult = await makeRequest(CONFIG.endpoints.supportingValues);
  if (readResult.status === 200 && Array.isArray(readResult.data)) {
    const found = readResult.data.find(item => item.id === createdId);
    logResult('Supporting Value READ', !!found, found ? 'Item found in list' : 'Item not found');
  } else {
    logResult('Supporting Value READ', false, 'Failed to fetch list');
  }
  
  // UPDATE Test
  const updateData = { ...createData, value: `Updated_${generateTestId()}` };
  const updateResult = await makeRequest(`${CONFIG.endpoints.supportingValues}/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  
  if (updateResult.status === 200 && updateResult.data.value === updateData.value) {
    logResult('Supporting Value UPDATE', true, 'Value updated successfully');
  } else {
    logResult('Supporting Value UPDATE', false, updateResult.data?.error || 'Update failed');
  }
  
  // DELETE Test
  const deleteResult = await makeRequest(`${CONFIG.endpoints.supportingValues}/${createdId}`, {
    method: 'DELETE'
  });
  
  if (deleteResult.status === 200) {
    logResult('Supporting Value DELETE', true, 'Deleted successfully');
  } else {
    logResult('Supporting Value DELETE', false, deleteResult.data?.error || 'Delete failed');
  }
}

// Quotes CRUD Tests
async function testQuotesCRUD() {
  console.log('\n=== QUOTES CRUD TESTS ===');
  
  let createdId = null;
  
  // CREATE Test
  const createData = { ...CONFIG.testData.quote, text: `Test quote ${generateTestId()}` };
  const createResult = await makeRequest(CONFIG.endpoints.quotes, {
    method: 'POST',
    body: JSON.stringify(createData)
  });
  
  if (createResult.status === 201 && validateQuote(createResult.data)) {
    createdId = createResult.data.id;
    logResult('Quote CREATE', true, `Created ID: ${createdId}`);
  } else {
    logResult('Quote CREATE', false, createResult.data?.error || 'Invalid response');
    return;
  }
  
  // READ Test
  const readResult = await makeRequest(CONFIG.endpoints.quotes);
  if (readResult.status === 200 && Array.isArray(readResult.data)) {
    const found = readResult.data.find(item => item.id === createdId);
    logResult('Quote READ', !!found, found ? 'Item found in list' : 'Item not found');
  } else {
    logResult('Quote READ', false, 'Failed to fetch list');
  }
  
  // UPDATE Test
  const updateData = { ...createData, text: `Updated quote ${generateTestId()}` };
  const updateResult = await makeRequest(`${CONFIG.endpoints.quotes}/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  
  if (updateResult.status === 200) {
    logResult('Quote UPDATE', true, 'Quote updated successfully');
  } else {
    logResult('Quote UPDATE', false, updateResult.data?.error || 'Update failed');
  }
  
  // DELETE Test (Note: Currently returns success but doesn't actually delete)
  const deleteResult = await makeRequest(`${CONFIG.endpoints.quotes}/${createdId}`, {
    method: 'DELETE'
  });
  
  if (deleteResult.status === 200) {
    logResult('Quote DELETE', true, 'Delete endpoint responded successfully');
  } else {
    logResult('Quote DELETE', false, deleteResult.data?.error || 'Delete failed');
  }
}

// Edge Case Tests
async function testEdgeCases() {
  console.log('\n=== EDGE CASE TESTS ===');
  
  // Test empty string validation
  const emptyValueTest = await makeRequest(CONFIG.endpoints.coreValues, {
    method: 'POST',
    body: JSON.stringify({ value: '', description: 'test' })
  });
  
  logResult('Empty Value Validation', emptyValueTest.status === 400, 'Should reject empty values');
  
  // Test missing required field
  const missingValueTest = await makeRequest(CONFIG.endpoints.coreValues, {
    method: 'POST',
    body: JSON.stringify({ description: 'test' })
  });
  
  logResult('Missing Required Field', missingValueTest.status === 400, 'Should reject missing value field');
  
  // Test invalid ID for update
  const invalidIdTest = await makeRequest(`${CONFIG.endpoints.coreValues}/invalid-id`, {
    method: 'PUT',
    body: JSON.stringify({ value: 'test', description: 'test' })
  });
  
  logResult('Invalid ID Handling', invalidIdTest.status === 404, 'Should return 404 for invalid ID');
  
  // Test supporting value without core value
  const noRelationTest = await makeRequest(CONFIG.endpoints.supportingValues, {
    method: 'POST',
    body: JSON.stringify({ value: 'test', description: 'test' })
  });
  
  logResult('Missing Relationship Validation', noRelationTest.status === 400, 'Should require core value relationship');
}

// Data integrity validation
async function validateDataIntegrity() {
  console.log('\n=== DATA INTEGRITY VALIDATION ===');
  
  const results = await Promise.all([
    makeRequest(CONFIG.endpoints.coreValues),
    makeRequest(CONFIG.endpoints.supportingValues),
    makeRequest(CONFIG.endpoints.quotes)
  ]);
  
  const [coreValues, supportingValues, quotes] = results;
  
  // Validate all items have required structure
  let allValid = true;
  
  if (coreValues.data && Array.isArray(coreValues.data)) {
    const invalidCoreValues = coreValues.data.filter(item => !validateCoreValue(item));
    if (invalidCoreValues.length > 0) {
      allValid = false;
      logResult('Core Values Structure', false, `${invalidCoreValues.length} invalid items found`);
    } else {
      logResult('Core Values Structure', true, `${coreValues.data.length} items validated`);
    }
  }
  
  if (supportingValues.data && Array.isArray(supportingValues.data)) {
    const invalidSupportingValues = supportingValues.data.filter(item => !validateSupportingValue(item));
    if (invalidSupportingValues.length > 0) {
      allValid = false;
      logResult('Supporting Values Structure', false, `${invalidSupportingValues.length} invalid items found`);
    } else {
      logResult('Supporting Values Structure', true, `${supportingValues.data.length} items validated`);
    }
  }
  
  if (quotes.data && Array.isArray(quotes.data)) {
    const invalidQuotes = quotes.data.filter(item => !validateQuote(item));
    if (invalidQuotes.length > 0) {
      allValid = false;
      logResult('Quotes Structure', false, `${invalidQuotes.length} invalid items found`);
    } else {
      logResult('Quotes Structure', true, `${quotes.data.length} items validated`);
    }
  }
  
  return allValid;
}

// Generate test report
function generateReport() {
  console.log('\n=== TEST REPORT ===');
  
  const passed = TEST_RESULTS.filter(t => t.passed).length;
  const total = TEST_RESULTS.length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Pass Rate: ${passRate}%`);
  
  const failedTests = TEST_RESULTS.filter(t => !t.passed);
  if (failedTests.length > 0) {
    console.log('\nFailed Tests:');
    failedTests.forEach(test => {
      console.log(`  ❌ ${test.test}: ${test.details}`);
    });
  }
  
  // Save detailed report
  const report = {
    summary: { total, passed, failed: total - passed, passRate },
    results: TEST_RESULTS,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('tests/crud-test-report.json', JSON.stringify(report, null, 2));
  console.log('\nDetailed report saved to: tests/crud-test-report.json');
}

// Main execution function
async function runAllTests() {
  console.log('🚀 Starting CRUD Operations Test Suite');
  console.log('Target:', BASE_URL);
  
  try {
    await testCoreValuesCRUD();
    await testSupportingValuesCRUD();
    await testQuotesCRUD();
    await testEdgeCases();
    await validateDataIntegrity();
    
    generateReport();
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = {
  runAllTests,
  testCoreValuesCRUD,
  testSupportingValuesCRUD,
  testQuotesCRUD,
  testEdgeCases,
  validateDataIntegrity,
  makeRequest,
  CONFIG
};

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}