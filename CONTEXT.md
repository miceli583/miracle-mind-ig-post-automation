# 🧠 AI Context - Miracle Mind Tooling

## Project Overview
This is an all-in-one business automation and content management hub built with Next.js 15. The platform centralizes workflow management, content creation, social media automation, and various business tools for streamlined operations.

## 🎯 AI Integration Guidelines

### What This Project Is
- **Business automation platform** for content creation and management
- **Social media post generator** with advanced typography and markup
- **Content management system** with relational data organization
- **Admin dashboard** for business operations and analytics

### What This Project Is NOT
- Not a generic web app template
- Not a blog or marketing site
- Not a consumer-facing social platform
- Not focused on user registration/authentication beyond admin access

## 🏗️ Architecture Patterns

### Next.js 15 App Router Structure
```
/src/app/biztools/          # Main business tools routing
├── admin/                  # Admin dashboard and tools
│   ├── daily-value-manager/ # Content management
│   └── post-generator/     # Image generation tools
└── login/                  # Simple password auth
```

### API Design Patterns
- **RESTful endpoints** under `/api/`
- **Admin routes** protected with simple password auth
- **Generation APIs** for image and content creation
- **CRUD operations** for data management

## 🔧 Development Standards

### Code Quality Requirements
- **TypeScript strict mode** - All code must be typed
- **ESLint compliance** - No warnings allowed
- **Build success** - Must compile without errors
- **Modular design** - Files under 500 lines preferred

### File Organization Rules
- **Source files** go in `/src/` only
- **Documentation** goes in `/docs/` with proper categorization
- **Tests** go in `/tests/` directory
- **NO root directory clutter** - Follow CLAUDE.md guidelines

### Naming Conventions
- **API routes**: kebab-case (`generate-post-image`)
- **Components**: PascalCase (`PostGenerator`)
- **Files**: kebab-case for pages, PascalCase for components
- **Database**: snake_case for JSON data fields

## 🎨 UI/UX Standards

### Design System
- **Dark theme** with black backgrounds (#000000)
- **Accent colors**: Yellow (#FBBF24) and Cyan (#06B6D4)
- **Typography**: Consistent font hierarchy
- **Responsive design** for desktop and mobile

### Component Patterns
- **Two-column layouts** for admin interfaces
- **Card-based design** for dashboard elements
- **Gradient hover effects** on interactive elements
- **Loading states** for async operations

## 📊 Data Management

### Supabase PostgreSQL Database
- **Relational structure** using Supabase PostgreSQL with Drizzle ORM
- **Core values**, **supporting values**, **quotes**, and **authors** entities
- **Thematic relationships** via junction tables with foreign key constraints
- **Cloud-hosted** on Supabase with full ACID compliance and real-time capabilities
- **Migration completed** from JSON files to production database
- **Service layer** at `/src/lib/supabase-database.ts` handles all database operations

### Content Types
- **Inspirational quotes** with attribution
- **Core business values** with detailed descriptions
- **Supporting values** linked to core values
- **Generated posts** combining quotes and values

## 🔐 Security Considerations

### Authentication
- **Simple password-based** admin authentication
- **Session management** with middleware
- **Protected routes** under `/biztools/admin/`
- **No sensitive data** in client-side code

### Environment Safety
- **No hardcoded secrets** in source code
- **Environment variables** for sensitive configuration
- **Build-time validation** of required env vars

## 🚀 Deployment & Performance

### Build Requirements
- **Static generation** where possible
- **Edge runtime** for dynamic routes
- **Image optimization** with Next.js Image component
- **Bundle size awareness** - monitor First Load JS

### API Performance
- **Efficient data fetching** patterns
- **Error handling** with proper HTTP status codes
- **Response compression** for large datasets
- **Caching strategies** where appropriate

## 🧪 Testing Philosophy

### Current State
- **Manual testing** workflow established
- **Build validation** as primary quality gate
- **Integration testing** for API endpoints
- **No unit test suite** (focused on integration)

### Future Considerations
- **API endpoint testing** with real data validation
- **Component integration testing** for admin interfaces
- **Performance testing** for image generation
- **E2E testing** for critical user flows

## 📝 Documentation Standards

### Code Documentation
- **Inline comments** only when necessary for complex logic
- **Function signatures** should be self-documenting
- **README updates** for major feature additions
- **API documentation** in technical guides

### Project Management
- **Sprint/backlog system** in `/docs/project-management/`
- **Technical documentation** organized by category
- **Change tracking** in git commits with consistent format
- **Context files** at each hierarchy level for AI assistance

## 🤖 AI Collaboration Best Practices

### When Working on This Project
1. **Read context files** at relevant hierarchy levels
2. **Follow established patterns** in existing code
3. **Maintain TypeScript compliance** at all times
4. **Test build success** after major changes
5. **Use TodoWrite tool** for complex multi-step tasks
6. **Follow CLAUDE.md guidelines** for file organization

### Common Tasks
- **Adding new API endpoints**: Follow existing patterns in `/src/app/api/`
- **Creating admin interfaces**: Use established card-based layouts
- **Data manipulation**: Respect the relational JSON structure
- **Image generation**: Extend existing markup and typography system
- **Documentation updates**: Maintain the sprint/backlog workflow

---
*This context file helps AI assistants understand the project structure, standards, and best practices for effective collaboration.*