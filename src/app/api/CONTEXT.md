# 🚀 API Context - `/src/app/api/`

## API Architecture Overview

This directory contains all server-side API endpoints following Next.js 15 App Router conventions. All routes are organized by feature and follow RESTful principles.

```
src/app/api/
├── admin/              # Admin-specific operations
├── auth/               # Authentication endpoints
├── debug/              # Development and debugging tools
├── generate-*/         # Image and content generation
└── [feature]/          # Feature-specific endpoints
```

## 🔧 Development Patterns

### Standard Route Structure
```typescript
// route.ts - Standard pattern for all endpoints
import { NextRequest, NextResponse } from 'next/server'
import { getCoreValues, getQuotes } from '@/lib/supabase-database'
import type { CoreValue, Quote } from '@/types/database-relational'

export async function GET() {
  try {
    // Business logic using Supabase service layer
    const data = await getCoreValues() // Type-safe database operation
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validation logic
    const result = await processData(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    )
  }
}
```

### Error Handling Standards
```typescript
// Standard error responses
const errorResponses = {
  badRequest: NextResponse.json(
    { error: 'Invalid request data' },
    { status: 400 }
  ),
  notFound: NextResponse.json(
    { error: 'Resource not found' },
    { status: 404 }
  ),
  serverError: NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  ),
  unauthorized: NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  )
}
```

## 📊 Data Management APIs

### Location: `/api/admin/`

#### CRUD Operations Pattern
```typescript
// GET /api/admin/resources
export async function GET() {
  const resources = await getCoreValues() // Supabase service layer
  return NextResponse.json(resources)
}

// POST /api/admin/resources
export async function POST(request: NextRequest) {
  const newResource = await request.json()
  const created = await createResource(newResource)
  return NextResponse.json(created, { status: 201 })
}

// PUT /api/admin/resources/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const updates = await request.json()
  const updated = await updateResource(params.id, updates)
  return NextResponse.json(updated)
}

// DELETE /api/admin/resources/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteResource(params.id)
  return NextResponse.json({ success: true })
}
```

#### Data Validation Patterns
```typescript
import { z } from 'zod'

const ResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  category: z.enum(['type1', 'type2'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ResourceSchema.parse(body)
    // Process validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    throw error
  }
}
```

## 🔐 Authentication APIs

### Location: `/api/auth/`

#### Login Endpoint Pattern
```typescript
// POST /api/auth/login
export async function POST(request: NextRequest) {
  const { password } = await request.json()
  
  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return response
  }
  
  return NextResponse.json(
    { error: 'Invalid password' },
    { status: 401 }
  )
}
```

#### Logout Endpoint Pattern
```typescript
// POST /api/auth/logout
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('auth')
  return response
}
```

## 🎨 Content Generation APIs

### Location: `/api/generate-*/`

#### Image Generation Pattern
```typescript
// POST /api/generate-post-image
export async function POST(request: NextRequest) {
  try {
    const { text, style } = await request.json()
    
    // Generate image using Puppeteer/Canvas
    const imageBuffer = await generateImage(text, style)
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    )
  }
}
```

#### Random Content Generation
```typescript
// GET /api/generate-random-post
export async function GET() {
  const quotes = await loadData('quotes')
  const coreValues = await loadData('core-values')
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  const randomValue = coreValues[Math.floor(Math.random() * coreValues.length)]
  
  return NextResponse.json({
    quote: randomQuote,
    coreValue: randomValue,
    combinedText: `${randomQuote.text} - ${randomValue.title}`
  })
}
```

## 🛠️ Utility and Debug APIs

### Location: `/api/debug/`

#### Database Structure Analysis
```typescript
// GET /api/debug/db-structure
export async function GET() {
  const structure = {
    quotes: (await loadData('quotes')).length,
    coreValues: (await loadData('core-values')).length,
    authors: (await loadData('authors')).length,
    relationships: await analyzeRelationships()
  }
  
  return NextResponse.json(structure)
}
```

#### Data Validation Endpoints
```typescript
// GET /api/debug/data-check
export async function GET() {
  const validation = await validateDataIntegrity()
  
  return NextResponse.json({
    valid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings,
    timestamp: new Date().toISOString()
  })
}
```

## 📈 Performance Optimization

### Caching Strategies
```typescript
// In-memory caching for frequently accessed data
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  const cacheKey = 'expensive-operation'
  
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey)
    if (Date.now() - timestamp < CACHE_TTL) {
      return NextResponse.json(data)
    }
  }
  
  const data = await expensiveOperation()
  cache.set(cacheKey, { data, timestamp: Date.now() })
  
  return NextResponse.json(data)
}
```

### Response Compression
```typescript
// For large datasets, consider compression
import { gzip } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)

export async function GET() {
  const largeData = await loadLargeDataset()
  const jsonData = JSON.stringify(largeData)
  
  if (jsonData.length > 1024) {
    const compressed = await gzipAsync(jsonData)
    return new NextResponse(compressed, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip'
      }
    })
  }
  
  return NextResponse.json(largeData)
}
```

## 🧪 Testing API Endpoints

### Manual Testing Approach
```bash
# Test GET endpoints
curl http://localhost:3000/api/admin/quotes

# Test POST endpoints
curl -X POST http://localhost:3000/api/admin/quotes \
  -H "Content-Type: application/json" \
  -d '{"text":"Test quote","author_id":1}'

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}'
```

### Integration Testing Pattern
```typescript
// In development, create test endpoints
// GET /api/test/integration
export async function GET() {
  const tests = [
    await testDataIntegrity(),
    await testRelationships(),
    await testImageGeneration()
  ]
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results: tests,
    allPassed: tests.every(t => t.passed)
  })
}
```

## 🔄 Common Development Tasks

### Adding New API Endpoint
1. **Create route directory** in appropriate section
2. **Implement route.ts** with standard error handling
3. **Add TypeScript interfaces** if new data types
4. **Test manually** with curl or admin interface
5. **Update documentation** if complex operations

### Modifying Existing Endpoint
1. **Read current implementation** to understand patterns
2. **Maintain backward compatibility** where possible
3. **Update error handling** if logic changes
4. **Test all HTTP methods** affected
5. **Verify integration** with admin interface

### Data Migration
1. **Create backup** of existing data files
2. **Implement migration endpoint** in `/api/admin/`
3. **Test on copy** of production data
4. **Document migration process** in technical guides
5. **Plan rollback strategy** if needed

---
*This context file provides comprehensive guidance for API development within the Next.js App Router structure.*