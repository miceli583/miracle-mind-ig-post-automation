# 🧰 Library Context - `/src/lib/`

## Library Structure Overview

```
src/lib/
├── data-management/    # JSON file operations and validation
├── image-generation/   # Canvas and PNG creation utilities
├── auth/              # Authentication helpers
├── utils/             # General utility functions
└── types/             # Shared type definitions and validation
```

## 🗄️ Data Management (`/src/lib/data-management/`)

### JSON File Operations Pattern
```typescript
import fs from 'fs/promises'
import path from 'path'

interface DataLoader<T> {
  load: (filename: string) => Promise<T[]>
  save: (filename: string, data: T[]) => Promise<void>
  validate: (data: T[]) => boolean
}

// Standard data loading pattern
export async function loadData<T>(filename: string): Promise<T[]> {
  try {
    const dataPath = path.join(process.cwd(), 'data', `${filename}.json`)
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error)
    return []
  }
}

// Standard data saving pattern
export async function saveData<T>(
  filename: string, 
  data: T[]
): Promise<void> {
  try {
    const dataPath = path.join(process.cwd(), 'data', `${filename}.json`)
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Failed to save ${filename}:`, error)
    throw error
  }
}
```

### Relational Data Utilities
```typescript
// Relationship resolution patterns
export function resolveRelationships<T extends { id: number }>(
  entities: T[],
  relationshipIds: number[]
): T[] {
  return relationshipIds
    .map(id => entities.find(entity => entity.id === id))
    .filter(Boolean) as T[]
}

// Data validation patterns
export function validateDataIntegrity(data: {
  quotes: Quote[]
  coreValues: CoreValue[]
  authors: Author[]
}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check for orphaned relationships
  data.quotes.forEach(quote => {
    quote.core_value_ids?.forEach(valueId => {
      if (!data.coreValues.find(cv => cv.id === valueId)) {
        errors.push(`Quote ${quote.id} references non-existent core value ${valueId}`)
      }
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
```

## 🎨 Image Generation (`/src/lib/image-generation/`)

### Canvas-Based Rendering
```typescript
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function generateTextImage(
  text: string,
  options: ImageGenerationOptions
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  })
  
  try {
    const page = await browser.newPage()
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: options.width || 1080,
      height: options.height || 1080,
      deviceScaleFactor: 2
    })
    
    // Generate HTML content
    const html = generateImageHTML(text, options)
    await page.setContent(html)
    
    // Wait for fonts and rendering
    await page.waitForTimeout(1000)
    
    // Generate screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
      omitBackground: false
    })
    
    return screenshot as Buffer
  } finally {
    await browser.close()
  }
}
```

### Text Markup Processing
```typescript
// Markup parsing for rich text formatting
export function parseTextWithMarkup(text: string): ProcessedText {
  // Parse *italic* and **turquoise** markup
  const segments: TextSegment[] = []
  let currentIndex = 0
  
  // Regex patterns for markup
  const italicPattern = /\*([^*]+)\*/g
  const turquoisePattern = /\*\*([^*]+)\*\*/g
  
  // Process text while preserving spaces
  const processedText = text.replace(
    /(\*\*[^*]+\*\*|\*[^*]+\*)/g,
    (match, markup) => {
      if (markup.startsWith('**') && markup.endsWith('**')) {
        return `<span style="color: #06B6D4;">${markup.slice(2, -2)}</span>`
      } else if (markup.startsWith('*') && markup.endsWith('*')) {
        return `<em>${markup.slice(1, -1)}</em>`
      }
      return match
    }
  )
  
  return {
    html: processedText,
    plainText: text.replace(/\*\*?([^*]+)\*\*?/g, '$1')
  }
}
```

### HTML Template Generation
```typescript
export function generateImageHTML(
  text: string,
  options: ImageGenerationOptions
): string {
  const processedText = parseTextWithMarkup(text)
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        
        body {
          margin: 0;
          padding: 60px;
          width: ${options.width - 120}px;
          height: ${options.height - 120}px;
          background: linear-gradient(135deg, #000 0%, #111 100%);
          font-family: 'Crimson Text', serif;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
        }
        
        .content {
          color: white;
          font-size: 48px;
          line-height: 1.4;
          text-align: left;
          max-width: 100%;
          word-wrap: break-word;
        }
        
        .content em {
          font-style: italic;
          color: inherit;
        }
        
        .content span[style*="color: #06B6D4"] {
          color: #06B6D4 !important;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="content">${processedText.html}</div>
    </body>
    </html>
  `
}
```

## 🔐 Authentication (`/src/lib/auth/`)

### Session Management
```typescript
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth')
    return authCookie?.value === 'authenticated'
  } catch {
    return false
  }
}

export function getAuthStatus(request: NextRequest): boolean {
  const authCookie = request.cookies.get('auth')
  return authCookie?.value === 'authenticated'
}

export function createAuthCookie(): string {
  // Simple session management
  return 'authenticated'
}

export function clearAuthCookie(): void {
  const cookieStore = cookies()
  cookieStore.delete('auth')
}
```

### Password Validation
```typescript
export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminPassword) {
    console.warn('ADMIN_PASSWORD not set in environment variables')
    return false
  }
  
  return password === adminPassword
}

export function hashPassword(password: string): string {
  // For future implementation if needed
  // Currently using simple comparison
  return password
}
```

## 🛠️ Utility Functions (`/src/lib/utils/`)

### Data Transformation
```typescript
// Common data transformation utilities
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string | number
): Record<string | number, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string | number, T[]>)
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function uniqueById<T extends { id: number }>(array: T[]): T[] {
  const seen = new Set<number>()
  return array.filter(item => {
    if (seen.has(item.id)) {
      return false
    }
    seen.add(item.id)
    return true
  })
}
```

### String Processing
```typescript
// Text processing utilities
export function truncateText(
  text: string, 
  maxLength: number, 
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, char => char.toUpperCase())
}
```

## 📊 Type Definitions (`/src/lib/types/`)

### Validation Schemas
```typescript
import { z } from 'zod'

// Zod schemas for runtime validation
export const QuoteSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  author_id: z.number(),
  core_value_ids: z.array(z.number()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export const CoreValueSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  supporting_value_ids: z.array(z.number()).optional(),
  color: z.string().optional(),
  priority: z.number().optional()
})

// Type inference from schemas
export type Quote = z.infer<typeof QuoteSchema>
export type CoreValue = z.infer<typeof CoreValueSchema>
```

### API Response Types
```typescript
// Standard API response structures
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
```

## 🔄 Common Development Patterns

### Error Handling
```typescript
// Centralized error handling utility
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleAsyncError<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  return promise
    .then<[T, null]>((data) => [data, null])
    .catch<[null, Error]>((error) => [null, error])
}
```

### Configuration Management
```typescript
// Environment configuration utility
export interface AppConfig {
  adminPassword: string
  nodeEnv: 'development' | 'production' | 'test'
  port: number
  dataDirectory: string
}

export function getConfig(): AppConfig {
  const requiredEnvVars = ['ADMIN_PASSWORD']
  const missing = requiredEnvVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  return {
    adminPassword: process.env.ADMIN_PASSWORD!,
    nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) || 'development',
    port: parseInt(process.env.PORT || '3000'),
    dataDirectory: process.env.DATA_DIR || 'data'
  }
}
```

---
*This context file provides comprehensive guidance for utility functions, data management, and shared libraries within the application.*