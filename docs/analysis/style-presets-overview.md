# Style Presets Overview

## Tool: daily-value-manager/image-gen

### Active Style Presets

#### Daily Anchor 2
- **Created:** 2025-08-26
- **Description:** Gold border variation of Daily Anchor design
- **Dimensions:** 1080x1350px (Instagram format)
- **Status:** Active (currently in use)
- **Key Features:**
  - **Solid gold border** (#D4AF37) - simplified from multi-color gradient
  - Dark gradient background with subtle lighting effects
  - "Your Daily Anchor" header with golden horizontal divider
  - Core Value and Supporting Value sections
  - Large quote text with author attribution
  - Bottom divider with @miraclemind.live handle
  - Typography: Sans-serif with varying weights (300-500)

### Archived Style Presets

#### Daily Anchor 1 `[ARCHIVED]`
- **Created:** 2025-08-26
- **Description:** Original "Today's Anchor" design with gradient border and golden dividers
- **Dimensions:** 1080x1350px (Instagram format)
- **Key Features:**
  - Multi-color gradient border (Cyan → Crimson → Gold → Crimson → Cyan)
  - Dark gradient background with subtle lighting effects
  - "Today's Anchor" header with golden horizontal divider
  - Core Value and Supporting Value sections
  - Large quote text with author attribution
  - Bottom divider with @miraclemind.live handle
  - Typography: Sans-serif with varying weights (300-500)

---

## Style Preset Guidelines

### Creating New Presets
- Use descriptive names that reflect the design theme
- Include creation date and clear description
- Define all styling properties in the configuration
- Test across different quote lengths and value combinations

### Archiving Process
- Set `archived: true` in the style preset configuration
- Update this overview document
- Keep archived presets for reference and potential restoration

### File Locations
- **Configuration:** `/src/config/style-presets.ts`
- **Implementation:** `/src/app/api/generate-image/route.ts`
- **UI:** `/src/app/admin/daily-value-manager/image-gen/page.tsx`

### Preset Structure
Each style preset includes:
- Unique ID and metadata
- Dimensions and layout properties
- Typography definitions
- Color schemes and gradients
- Border and spacing configurations
- Header, body, and footer styling

---

---

## Recent Changes
- **2025-08-26:** Updated Daily Anchor 2 header text to "Your Daily Anchor"
- **2025-08-26:** Modified Daily Anchor 2 - Changed border from multi-color gradient to solid gold
- **2025-08-26:** Created Daily Anchor 2 as active preset (copy of Daily Anchor 1)
- **2025-08-26:** Archived Daily Anchor 1 as baseline reference

*Last updated: 2025-08-26*