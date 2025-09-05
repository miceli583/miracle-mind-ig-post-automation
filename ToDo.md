# ToDo List

## Post-Generator Issues & Improvements

### 🐛 Critical Fixes
- [ ] **Fix spacing error on post-generator**
  - The markup system (`*italic*` and `**turquoise**`) is not preserving spaces around formatted words
  - Issue: "Becauselearning" instead of "Because learning"
  - Location: `/src/app/api/generate-text-image/route.ts` - `parseTextWithMarkup` function
  - Current attempts with flex layout and regex parsing haven't resolved the issue

### 🎨 UI/UX Improvements
- [x] **Fix UI on post-generator to match app aesthetic**
  - ✅ Updated to dark theme with black background
  - ✅ Added yellow and cyan accent colors
  - ✅ Enhanced buttons with gradients and hover effects
  - ✅ Improved typography and spacing
  - ✅ Added two-column layout with text/guide on left, image on right
  - ✅ Added styling guide section with visual examples
  - ✅ Scaled down image display for better page fit
  - Location: `/src/app/admin/post-generator/page.tsx`

- [ ] **Change post-generator to use serif fonts**
  - Currently generates images with Times New Roman
  - May need to switch to a different serif font for better consistency
  - Location: `/src/app/api/generate-text-image/route.ts` line 94

- [x] **Add UI button on admin page to lead to post-generator**
  - ✅ Added Post Generator card to admin dashboard with cyan theme
  - ✅ Matches existing card styling and dark aesthetic
  - ✅ Proper hover effects and gradient styling
  - Location: `/src/app/admin/page.tsx`

### 🧹 Cleanup Tasks
- [ ] **Clean up test images in directory**
  - Remove temporary image files from root directory:
    - `temp-img.png`
    - `test-*.png` files (multiple)
  - Keep organized development workflow

## Current Status
- Post-generator basic functionality works
- Markup system supports `*italic*` and `**turquoise**` text
- Left-aligned serif typography implemented
- Integration with admin authentication system complete
- ✅ Admin dashboard now has Post Generator card with proper styling
- ✅ Post-generator UI completely redesigned with dark theme
- ✅ Two-column layout with styling guide for better UX
- ✅ Responsive design that works on desktop and mobile

## Development Notes
- Dev server running on port 3001 (3000 was in use)
- API endpoint: `/api/generate-text-image`
- Frontend: `/admin/post-generator`
- Markup syntax: `*text*` for italic, `**text**` for turquoise color