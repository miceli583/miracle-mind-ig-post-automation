# 🎯 Product Backlog

## Epic: Post Generator Improvements

### 🐛 Critical Fixes
- [ ] **Fix spacing error on post-generator**
  - Priority: High
  - Issue: Markup system (`*italic*` and `**turquoise**`) not preserving spaces around formatted words
  - Example: "Becauselearning" instead of "Because learning"
  - Location: `/src/app/api/generate-text-image/route.ts` - `parseTextWithMarkup` function
  - Estimate: 2-3 hours

### 🎨 UI/UX Enhancements
- [ ] **Change post-generator to use serif fonts**
  - Priority: Medium
  - Currently generates images with Times New Roman
  - May need to switch to a different serif font for better consistency
  - Location: `/src/app/api/generate-text-image/route.ts` line 94
  - Estimate: 1-2 hours

### 🧹 Cleanup & Maintenance
- [ ] **Clean up test images in directory**
  - Priority: Low
  - Remove temporary image files from `/public/fonts/`:
    - `test-generic-serif.png`
    - `test-serif-font.png`
    - `test-times-serif.png`
    - `test-no-font.png`
  - Estimate: 15 minutes

## Epic: Content Management System

### 📊 Analytics & Reporting
- [ ] **Enhanced content analytics dashboard**
  - Priority: Medium
  - Track post performance metrics
  - Usage statistics for different content types
  - Estimate: 4-6 hours

### 🔄 Data Management
- [ ] **Database optimization**
  - Priority: Low
  - Review and optimize existing queries
  - Implement caching where appropriate
  - Estimate: 3-4 hours

## Epic: Performance & Optimization

### ⚡ Speed Improvements
- [ ] **Image generation optimization**
  - Priority: Medium
  - Optimize PNG generation pipeline
  - Implement image caching
  - Estimate: 2-3 hours

### 📱 Mobile Experience
- [ ] **Mobile responsiveness review**
  - Priority: Medium
  - Ensure all admin tools work well on mobile
  - Test post-generator on various screen sizes
  - Estimate: 2-4 hours

## Backlog Management Notes
- Items move from Backlog → Sprint → Done
- High priority items should be pulled into next sprint
- Estimates are rough - adjust based on actual complexity
- Review and groom backlog weekly