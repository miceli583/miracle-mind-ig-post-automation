# Claude Code Configuration - Miracle Mind Tooling

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

## Project Overview

This is an all-in-one business automation and content management hub built with Next.js. The platform centralizes workflow management, content creation, social media automation, and various business tools for streamlined operations.

## Build Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build project for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/lib` - Utility functions and data management
- `/src/types` - TypeScript type definitions
- `/data` - JSON data files for core values, quotes, and authors
- `/memory` - Project memory and cached data
- `/public` - Static assets including images and icons

## Key Features

- **Business Operations Hub** - Centralized dashboard for all business tools and workflows
- **Content Management System** - Manage inspirational values, quotes, and authors with relational mapping
- **Image Generation Tools** - Create custom Instagram posts with advanced text formatting and templates
- **Post Generator** - Advanced typography and markup system for social media content
- **Database Management** - Sophisticated relational data organization system
- **API Integration** - Webhook support for automation platforms like Make.com
- **Modular Architecture** - Designed to accommodate additional business tools as needed

## Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated

## Development Workflow

1. Use TodoWrite for task management and progress tracking
2. Batch related operations in single messages for efficiency
3. Organize files in appropriate subdirectories
4. Follow Next.js 15 app router conventions
5. Use TypeScript for type safety

## API Endpoints

- `/api/generate-post-image` - Generate Instagram post images
- `/api/generate-random-post` - Generate random post combinations
- `/api/generate-random-post-relational` - Generate thematically related posts
- `/api/admin/stats` - Admin dashboard statistics
- `/api/auth/login` - Simple password authentication

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.
