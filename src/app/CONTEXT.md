# 🌐 App Router Context - `/src/app/`

## Directory Structure Overview

```
src/app/
├── biztools/           # Main application namespace
│   ├── admin/          # Admin dashboard and management tools
│   └── login/          # Authentication interface
├── api/                # Server-side API endpoints
├── globals.css         # Global styles and Tailwind imports
└── layout.tsx          # Root layout with metadata
```

## 🏗️ Routing Architecture

### Route Organization
- **`/biztools/`** - Main application prefix for all business tools
- **`/biztools/admin/`** - Protected admin area requiring authentication
- **`/biztools/login/`** - Simple password-based authentication
- **`/api/`** - RESTful API endpoints for data operations

### Authentication Flow
```
Unauthenticated → /biztools/login
Authenticated → /biztools/admin (dashboard)
API calls → Protected by middleware
```

### Route Protection
- **Middleware** (`/src/middleware.ts`) protects `/biztools/admin/*`
- **Session-based** authentication with simple password
- **Redirect logic** for unauthenticated access attempts

## 📱 Page Component Patterns

### Standard Page Structure
```typescript
// /src/app/biztools/admin/feature/page.tsx
export default function FeaturePage() {
  // Page-level state and effects
  // Data fetching logic
  // Error handling
  // Loading states
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page content */}
    </div>
  )
}
```

### Layout Patterns
```typescript
// Two-column admin layout pattern
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div className="space-y-6">
    {/* Left column - controls/forms */}
  </div>
  <div className="space-y-6">
    {/* Right column - preview/results */}
  </div>
</div>
```

## 🎨 UI Component Standards

### Design System
- **Background**: Always `bg-black` for consistency
- **Text**: `text-white` primary, `text-gray-300` secondary
- **Accents**: `text-yellow-400` and `text-cyan-400`
- **Cards**: `bg-gray-900 rounded-lg border border-gray-700`

### Button Patterns
```typescript
// Primary action button
className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200"

// Secondary button
className="bg-gray-800 text-white px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-all duration-200"
```

### Form Components
```typescript
// Standard input styling
className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"

// Textarea styling
className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none resize-none"
```

## 🔄 Data Flow Patterns

### Client-Side Data Fetching
```typescript
const [data, setData] = useState<DataType[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  fetch('/api/endpoint')
    .then(res => res.json())
    .then(setData)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
}, [])
```

### Form Submission Patterns
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) throw new Error('Request failed')
    
    const result = await response.json()
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false)
  }
}
```

## 🛠️ API Route Development

### Location: `/src/app/api/`

### Standard API Route Structure
```typescript
// route.ts pattern
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Business logic
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validation and processing
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
```

### API Response Patterns
```typescript
// Success responses
NextResponse.json({ data, message: 'Success' })

// Error responses
NextResponse.json(
  { error: 'Descriptive error message' },
  { status: 400 | 404 | 500 }
)

// Created responses
NextResponse.json(newResource, { status: 201 })
```

## 📊 Admin Dashboard Architecture

### Location: `/src/app/biztools/admin/`

### Dashboard Card Pattern
```typescript
// Standard admin card component
<div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-200 group">
  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400">
    Feature Name
  </h3>
  <p className="text-gray-300 mb-4">
    Feature description
  </p>
  <button className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black px-4 py-2 rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600">
    Access Tool
  </button>
</div>
```

### Navigation Patterns
- **Breadcrumb navigation** for deep page hierarchies
- **Back buttons** with proper state management
- **Active state indicators** for current page/section

## 🎯 Feature Implementation Guidelines

### Adding New Admin Feature
1. **Create page** in `/src/app/biztools/admin/feature-name/page.tsx`
2. **Follow layout patterns** - use established grid systems
3. **Implement data fetching** - use standard error handling
4. **Add to dashboard** - create card component linking to feature
5. **Test authentication** - verify middleware protection works

### Creating New API Endpoint
1. **Create route file** in `/src/app/api/feature-name/route.ts`
2. **Implement HTTP methods** needed (GET, POST, PUT, DELETE)
3. **Add error handling** with appropriate status codes
4. **Test with admin interface** - ensure integration works
5. **Document in technical guides** if complex

### Image Generation Integration
- **Use existing patterns** from post-generator implementation
- **Canvas-based rendering** for dynamic content
- **Puppeteer integration** for HTML-to-PNG conversion
- **Responsive sizing** with quality optimization

## 🔐 Security Implementation

### Authentication Checks
```typescript
// In protected page components
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const [isAuthenticated, setIsAuthenticated] = useState(false)
const router = useRouter()

useEffect(() => {
  // Check authentication status
  // Redirect if not authenticated
}, [router])
```

### API Security
- **Input validation** on all endpoints
- **Error message sanitization** - don't leak sensitive info
- **Rate limiting considerations** for production
- **CORS handling** appropriate for deployment

## ⚡ Performance Considerations

### Page Optimization
- **Static generation** where possible (dashboard cards, etc.)
- **Dynamic imports** for heavy components
- **Image optimization** using Next.js Image component
- **Loading states** to improve perceived performance

### Bundle Optimization
- **Code splitting** by route
- **Tree shaking** - avoid importing entire libraries
- **CSS optimization** - use Tailwind's purging
- **Analytics monitoring** - track First Load JS sizes

## 🧪 Testing Approach

### Manual Testing Workflow
1. **Authentication flow** - login/logout functionality
2. **API integration** - test all CRUD operations
3. **UI responsiveness** - mobile and desktop layouts
4. **Error handling** - network failures, invalid inputs
5. **Performance** - image generation, data loading

### Development Workflow
```bash
# Local development
npm run dev

# Build validation
npm run build

# Lint checking
npm run lint
```

---
*This context file provides specific guidance for working within the Next.js App Router structure and admin interface development.*