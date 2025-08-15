export const DESIGN_CONFIG = {
  // Image dimensions (Instagram optimized)
  IMAGE: {
    WIDTH: 1080,
    HEIGHT: 1350,
    CONTAINER_WIDTH: 1020,
    CONTAINER_HEIGHT: 1290,
    PADDING: 60,
  },

  // Brand colors
  COLORS: {
    PRIMARY: '#f7c359',      // Gold
    SECONDARY: '#C5282F',    // Red
    BLACK: '#000000',
    GRAY: '#545454',
    WHITE: '#ffffff',
    BORDER: '#f7c359',
  },

  // Typography
  FONTS: {
    PRIMARY: "'Playfair Display', serif",
    SECONDARY: "'Cormorant Garamond', serif", 
    FOOTER: "'Noticia Text', serif",
  },

  // Font sizes (responsive based on content length)
  FONT_SIZES: {
    CORE_VALUE: {
      DEFAULT: '44px',
      LONG: '40px',    // > 20 chars
    },
    SUPPORTING_VALUE: '28px',
    QUOTE: {
      SHORT: '84px',   // <= 60 chars
      MEDIUM: '76px',  // 61-100 chars  
      LONG: '68px',    // > 100 chars
    },
    AUTHOR: '32px',
    FOOTER: '28px',
  },

  // Layout spacing
  SPACING: {
    HEADER_MARGIN: '20px',
    QUOTE_MARGIN: '30px',
    FOOTER_PADDING: '30px',
    ICON_MARGIN: '15px',
  },

  // Validation limits
  LIMITS: {
    CORE_VALUE: { MIN: 1, MAX: 50 },
    SUPPORTING_VALUE: { MIN: 1, MAX: 60 },
    QUOTE: { MIN: 10, MAX: 200 },
    AUTHOR: { MIN: 0, MAX: 30 },
  },

  // Brand elements
  BRAND: {
    HANDLE: '@miraclemind.live',
    ICON_SIZE: '32px',
    ICON_SVG_SIZE: '22px',
  },
} as const;

export const FONT_IMPORTS = [
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap', 
  'https://fonts.googleapis.com/css2?family=Noticia+Text:wght@400;700&display=swap',
] as const;