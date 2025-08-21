# CRUD Operations Test Plan - Instagram Post Automation

## Overview
This document outlines comprehensive testing for Core Values, Supporting Values, and Quotes CRUD operations with data backup and edge case validation.

## Test Environment Setup
- **Data Backup Created**: `database-relational-backup-[timestamp].json` and `database-backup-[timestamp].json`
- **Test Server**: Local development server (`npm run dev`)
- **Authentication**: Admin login required for CRUD operations

## API Endpoints Analysis

### Core Values
- **GET** `/api/admin/core-values` - Fetch all core values
- **POST** `/api/admin/core-values` - Create new core value
- **PUT** `/api/admin/core-values/[id]` - Update core value
- **PATCH** `/api/admin/core-values/[id]` - Archive core value
- **DELETE** `/api/admin/core-values/[id]` - Delete core value

### Supporting Values
- **GET** `/api/admin/supporting-values` - Fetch all supporting values
- **POST** `/api/admin/supporting-values` - Create new supporting value
- **PUT** `/api/admin/supporting-values/[id]` - Update supporting value
- **PATCH** `/api/admin/supporting-values/[id]` - Archive supporting value
- **DELETE** `/api/admin/supporting-values/[id]` - Delete supporting value

### Quotes
- **GET** `/api/admin/quotes-relational` - Fetch all quotes
- **POST** `/api/admin/quotes-relational` - Create new quote
- **PUT** `/api/admin/quotes-relational/[id]` - Update quote
- **DELETE** `/api/admin/quotes-relational/[id]` - Delete quote (soft delete)

## Data Structure Analysis

### Core Value Schema
```json
{
  "id": "string",
  "value": "string (required)",
  "description": "string (optional)",
  "isActive": "boolean (default: true)",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### Supporting Value Schema
```json
{
  "id": "string",
  "value": "string (required)",
  "description": "string (optional)",
  "coreValueIds": "array of strings (required)",
  "isActive": "boolean (default: true)",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### Quote Schema
```json
{
  "id": "string",
  "text": "string (required)",
  "authorId": "string (optional)",
  "category": "string (optional)",
  "tags": "array (optional)",
  "coreValueIds": "array of strings (optional)",
  "isActive": "boolean (default: true)",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Test Scenarios

### 1. Core Values CRUD Testing
#### CREATE Tests
- ✅ Valid core value creation
- ✅ Missing required field validation
- ✅ Empty string validation
- ✅ Whitespace trimming
- ✅ Default isActive value

#### READ Tests
- ✅ Fetch all core values
- ✅ Response format validation
- ✅ Error handling for server issues

#### UPDATE Tests
- ✅ Valid update operations
- ✅ Partial updates
- ✅ Non-existent ID handling
- ✅ Field validation on update

#### ARCHIVE Tests
- ✅ Archive operation via PATCH
- ✅ Invalid action handling
- ✅ Non-existent ID handling

#### DELETE Tests
- ✅ Hard delete operations
- ✅ Non-existent ID handling
- ✅ Cascade delete validation

### 2. Supporting Values CRUD Testing
#### CREATE Tests
- ✅ Valid supporting value creation
- ✅ Core value relationship validation
- ✅ Multiple core value associations
- ✅ Missing coreValueId validation

#### READ Tests
- ✅ Fetch all supporting values
- ✅ Relationship data inclusion

#### UPDATE Tests
- ✅ Update supporting value properties
- ✅ Update core value relationships
- ✅ Validation of relationship changes

#### DELETE Tests
- ✅ Hard delete operations
- ✅ Relationship cleanup validation

### 3. Quotes CRUD Testing
#### CREATE Tests
- ✅ Valid quote creation
- ✅ Missing text validation
- ✅ Optional field handling
- ✅ Core value associations

#### READ Tests
- ✅ Fetch all quotes
- ✅ Relationship data validation

#### UPDATE Tests
- ✅ Update quote properties
- ✅ Update relationships
- ✅ Validation handling

#### DELETE Tests
- ✅ Soft delete implementation
- ✅ Note: DELETE endpoint returns success but no actual deletion

## Edge Cases and Error Scenarios

### Input Validation
- Empty strings
- Null values
- Undefined values
- Invalid data types
- Excessively long strings
- Special characters
- SQL injection attempts
- XSS attempts

### Relationship Integrity
- Invalid core value IDs
- Orphaned supporting values
- Circular references
- Bulk operations

### Concurrency Issues
- Simultaneous updates
- Race conditions
- Data consistency

### Error Handling
- Server errors (500)
- Not found errors (404)
- Validation errors (400)
- Network failures
- Timeout scenarios

## Data Integrity Validation

### Pre-Test Data Count
- Core Values: 5 items
- Supporting Values: 15+ items
- Quotes: Multiple items (need to verify count)

### Post-Test Validation
- Verify all created items exist
- Verify all updates were applied
- Verify all deletions were processed
- Check relationship integrity
- Validate timestamp updates

## Test Execution Order
1. Data backup verification
2. Core Values CRUD operations
3. Supporting Values CRUD operations
4. Quotes CRUD operations
5. Edge case testing
6. Data integrity validation
7. Backup restoration test

## Risk Mitigation
- ✅ **Data Backup**: Created before testing
- **Rollback Plan**: Restore from backup if data corruption occurs
- **Isolation**: Test on development environment only
- **Validation**: Verify data integrity after each operation

## Test Tools
- **HTTP Client**: curl commands
- **Validation**: JSON schema validation
- **Monitoring**: Server logs and error tracking
- **Backup**: Timestamped database copies

## Success Criteria
- All CRUD operations function correctly
- Proper error handling and validation
- Data relationships maintained
- No data corruption
- Backup/restore functionality verified