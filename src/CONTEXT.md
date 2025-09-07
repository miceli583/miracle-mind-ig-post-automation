# 🔧 Source Code Context - `/src/`

## Directory Structure Overview

```
src/
├── app/              # Next.js 15 App Router
├── lib/              # Utility functions and data management
├── types/            # TypeScript type definitions
├── config/           # Configuration files
└── middleware.ts     # Route protection and auth
```

## 🏗️ Architecture Patterns

### App Router Structure (`/src/app/`)
- **`/biztools/`** - Main application routing prefix
- **`/api/`** - Server-side API endpoints
- **Route Groups** - Organized by feature area
- **Layouts** - Shared UI components and authentication

### Library Organization (`/src/lib/`)
- **Data management** - Complete Supabase PostgreSQL service layer with full CRUD operations
- **Database service** - Production-ready database operations with relationship management
- **Utility functions** - Reusable business logic and data transformation helpers
- **Image generation** - Canvas and PNG creation utilities
- **Authentication** - Simple password-based auth helpers

## 🎯 Development Standards

### TypeScript Requirements
- **Strict mode enabled** - All code must be properly typed
- **Interface definitions** in `/src/types/` directory
- **Type imports** should be explicit and organized
- **No `any` types** without explicit justification

### File Naming Conventions
```
pages/          -> kebab-case (post-generator)
components/     -> PascalCase (PostGenerator.tsx)
utilities/      -> camelCase (parseTextMarkup.ts)
types/          -> kebab-case (database-relational.ts)
API routes/     -> kebab-case (generate-post-image)
```

### Import Organization
```typescript
// 1. External libraries
import { NextResponse } from 'next/server'

// 2. Internal types
import type { CoreValue, Quote } from '@/types/database'

// 3. Internal utilities
import { loadData, saveData } from '@/lib/data-management'

// 4. Local imports
import './styles.css'
```

## 🔄 Data Flow Patterns

### API Route Structure
```typescript
// Standard API route pattern
export async function GET() {
  try {
    const data = await getQuotes() // Supabase database call
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load data' }, 
      { status: 500 }
    )
  }
}
```

### Data Management
- **Supabase PostgreSQL** as primary database with full ACID compliance
- **Relational structure** with foreign key constraints and junction tables
- **Service layer** at `/src/lib/supabase-database.ts` for all database operations
- **Type-safe queries** using Supabase client with proper error handling

### Component Patterns
```typescript
// Standard component structure
interface Props {
  // Props interface first
}

export default function ComponentName({ prop }: Props) {
  // Hooks and state
  // Event handlers
  // Render logic
}
```

## 🎨 UI Development Guidelines

### Styling Approach
- **Tailwind CSS** for all styling
- **Dark theme** as primary design system
- **Responsive design** with mobile-first approach
- **Consistent spacing** using Tailwind's scale

### Color Palette
```css
/* Primary Colors */
background: #000000 (black)
accent-yellow: #FBBF24 
accent-cyan: #06B6D4
text-primary: #FFFFFF
text-secondary: #9CA3AF
```

### Component Architecture
- **Composition over inheritance**
- **Props interfaces** for all components
- **Event handlers** passed down from parents
- **Loading states** for async operations

## 🔐 Security Implementation

### Authentication Middleware
```typescript
// Located in /src/middleware.ts
// Protects /biztools/admin/* routes
// Simple session-based authentication
```

### Security Best Practices
- **No secrets in client code**
- **Input validation** on all API endpoints
- **Error messages** don't leak sensitive information
- **CORS handling** appropriate for deployment

## 📊 Data Schema Patterns

### Core Entities
```typescript
interface CoreValue {
  id: number
  title: string
  description: string
  supporting_value_ids: number[]
}

interface Quote {
  id: number
  text: string
  author_id: number
  core_value_ids: number[]
}
```

### Relational Patterns
- **ID-based references** between entities
- **Array fields** for one-to-many relationships
- **Consistent naming** using snake_case for data fields
- **Immutable updates** when modifying data

## 🖼️ Image Generation System

### Canvas-Based Rendering
```typescript
// Located in /src/lib/image-generation/
// HTML-to-PNG conversion using Puppeteer
// Custom markup parsing for text formatting
// Responsive image sizing and quality
```

### Markup System
- **`*text*`** - Italic formatting
- **`**text**`** - Turquoise color highlighting
- **Serif typography** for generated content
- **Left-aligned layouts** for readability

## 🧪 Testing Considerations

### Current Testing Approach
- **Build validation** as primary quality gate
- **Manual testing** through admin interfaces
- **API testing** with real data validation
- **Integration focus** over unit testing

### Quality Assurance
```bash
# Required commands before commits
npm run build    # Must succeed
npm run lint     # Must pass without warnings
```

## 🔄 Common Development Tasks

### Adding New API Endpoint
1. Create route file in `/src/app/api/new-endpoint/route.ts`
2. Follow standard error handling patterns
3. Add TypeScript interfaces if needed
4. Test with real data before committing

### Creating New Page
1. Create page component in appropriate `/src/app/` subdirectory
2. Follow existing layout patterns
3. Implement responsive design
4. Add to navigation if needed

### Extending Data Models
1. Update interfaces in `/src/types/`
2. Modify data loading/saving utilities
3. Update any dependent API endpoints
4. Test data migration if needed

## ⚡ Performance Considerations

### Build Optimization
- **Static generation** for admin pages where possible
- **Dynamic imports** for heavy components
- **Image optimization** using Next.js Image component
- **Bundle analysis** for size monitoring

### Runtime Performance
- **Efficient data structures** for large datasets
- **Memoization** for expensive calculations
- **Proper loading states** for better UX
- **Error boundaries** for graceful failures

---
*This context file provides development-specific guidance for working in the `/src/` directory.*