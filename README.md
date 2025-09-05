# Miracle Mind Tooling

An all-in-one business automation and content management hub built with Next.js. This comprehensive tooling platform centralizes workflow management, content creation, and social media automation for streamlined business operations.

## 🚀 Features

### Content Management System
- **Daily Value Manager**: Manage inspirational core values, supporting values, and quotes
- **Relational Database**: Organize content with sophisticated relationship mapping
- **Content Analytics**: Track and analyze content performance

### Image Generation Tools
- **Post Generator**: Create custom Instagram posts with advanced text formatting
- **Template System**: Multiple design presets with dynamic typography
- **Markup Support**: Rich text formatting with `*italic*` and `**turquoise**` syntax

### Business Automation
- **Admin Dashboard**: Centralized control panel for all business tools
- **API Integration**: Webhook support for automation platforms like Make.com
- **Authentication System**: Secure access control for business operations

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: Edge Runtime for optimal performance
- **Styling**: Tailwind CSS with custom dark theme
- **Image Processing**: @vercel/og for dynamic image generation
- **Type Safety**: TypeScript with strict mode
- **Database**: JSON-based relational data management

## 🎯 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Platform**
   - Open [http://localhost:3000](http://localhost:3000)
   - Navigate to `/login` for admin access
   - Use `/admin` for the business operations hub

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/                 # Admin dashboard and tools
│   │   ├── daily-value-manager/  # Content management system
│   │   └── post-generator/       # Image generation tools
│   ├── api/                   # Backend API routes
│   │   ├── admin/            # Admin-specific endpoints
│   │   ├── auth/             # Authentication
│   │   └── generate-*/       # Image generation APIs
│   └── lib/                  # Utility functions
├── data/                     # JSON database files
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

The platform features a sophisticated dark theme with:
- **Primary Colors**: Yellow (#FBBF24) and Cyan (#22D3EE) accents
- **Background**: Pure black with gradient overlays
- **Typography**: Clean, modern font stack with serif options for content
- **Components**: Consistent card-based layouts with hover animations

## 🔐 Authentication

Simple password-based authentication system for secure access to business tools and sensitive operations.

## 📊 Business Tools

### Daily Value Manager
Complete content management system for organizing inspirational content with relational mapping between core values, supporting values, and quotes.

### Post Generator
Advanced image generation tool with:
- Custom text formatting and markup
- Dynamic font scaling based on content length
- Multiple design templates
- Instagram-optimized output

## 🚀 Deployment

Optimized for deployment on Vercel with:
- Edge Runtime support
- Automatic static optimization
- Built-in performance monitoring
- Zero-config deployment

## 📈 Future Enhancements

This platform is designed as a modular hub that can accommodate additional business tools and automation workflows as needed.

---

Built with ❤️ for streamlined business operations and content automation.