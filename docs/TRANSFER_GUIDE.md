# 📦 Project Transfer Guide

## Overview

This guide will help you successfully transfer and set up the **Miracle Mind Instagram Post Automation** project on a new machine or external drive.

## 🎯 What Transfers Automatically

✅ **Complete Source Code** - All Next.js components and API routes  
✅ **Git Repository** - Full commit history and branch information  
✅ **Project Configuration** - TypeScript, ESLint, Tailwind configs  
✅ **Data Files** - JSON databases with quotes, values, and authors  
✅ **Claude Code Integration** - CLAUDE.md configuration file  
✅ **Custom Assets** - Fonts, images, and test files  

## 🔧 Setup Requirements

### Prerequisites
- **Node.js 18+** (recommended: use nvm or similar)
- **Git** with SSH/HTTPS access to GitHub
- **NPM** or compatible package manager

### Required Environment Variables
Create `.env.local` in the project root with:
```bash
# Authentication (required for admin dashboard)
ADMIN_PASSWORD=your_secure_password_here

# Optional: Add any API keys for future integrations
# OPENAI_API_KEY=your_key_here
```

## 🚀 Transfer Steps

### 1. Copy Project Files
```bash
# If copying to external drive or new location
cp -r /path/to/miracle-mind-ig-post-automation /new/location/
cd /new/location/miracle-mind-ig-post-automation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
# Create environment file
touch .env.local

# Add your configuration (see example above)
nano .env.local
```

### 4. Configure Git (if needed)
```bash
# Verify git remote
git remote -v

# If SSH keys aren't set up, you can switch to HTTPS:
git remote set-url origin https://github.com/miceli583/miracle-mind-ig-post-automation.git
```

## ✅ Verification Steps

### 1. Run Development Server
```bash
npm run dev
```
Expected: Server starts on http://localhost:3000

### 2. Test Build Process
```bash
npm run build
```
Expected: Build completes without errors

### 3. Run Linting
```bash
npm run lint
```
Expected: No linting errors

### 4. Verify Core Features
- **Main Page**: Visit http://localhost:3000
- **Admin Login**: Go to `/login` and use your admin password
- **Image Generation**: Test the post generator in admin dashboard
- **Data Access**: Verify quotes and values load correctly

## 🔍 Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Git authentication issues**
```bash
# For SSH issues, switch to HTTPS
git remote set-url origin https://github.com/miceli583/miracle-mind-ig-post-automation.git

# For HTTPS, ensure GitHub credentials are configured
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Port 3000 already in use**
```bash
# Run on different port
npm run dev -- -p 3001
```

**Environment variable issues**
- Ensure `.env.local` exists in project root
- Check that `ADMIN_PASSWORD` is set
- Restart development server after changing .env files

### Performance Issues
- **Slow image generation**: Ensure sufficient RAM (4GB+ recommended)
- **Build timeouts**: Close other applications to free up system resources

## 📁 Project Structure Overview

```
miracle-mind-ig-post-automation/
├── src/app/                 # Next.js app router pages
├── src/lib/                 # Utility functions and data management
├── src/types/               # TypeScript definitions
├── data/                    # JSON databases
├── public/                  # Static assets
├── docs/                    # Documentation (including this guide)
├── CLAUDE.md               # Claude Code configuration
└── package.json            # Dependencies and scripts
```

## 🎯 First Tasks After Transfer

1. **Update Admin Password** - Change the default password in `.env.local`
2. **Test Image Generation** - Verify the core functionality works
3. **Backup Data Files** - Consider backing up `/data/*.json` files
4. **Review Git Status** - Check if you need to commit any local changes

## 🆘 Need Help?

If you encounter issues during transfer:

1. Check this troubleshooting section
2. Verify Node.js version: `node --version`
3. Ensure all environment variables are set
4. Review the main README.md for additional context

## 🔄 Keeping In Sync

To keep your transferred project updated:
```bash
git fetch origin
git pull origin main
npm install  # In case dependencies changed
```

---

**Transfer completed successfully?** 🎉  
Run `npm run dev` and visit http://localhost:3000 to start generating beautiful Instagram posts!