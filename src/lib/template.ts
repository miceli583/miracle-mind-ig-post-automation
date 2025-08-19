import { DESIGN_CONFIG, FONT_IMPORTS } from '@/config/design';
import { SanitizedQuoteData, escapeHtml } from './sanitization';
import fs from 'fs';
import path from 'path';

function loadIconSvg(): string {
  try {
    const iconPath = path.join(process.cwd(), 'public', 'images', 'icons', 'dove.svg');
    const svgContent = fs.readFileSync(iconPath, 'utf-8');
    // Create a data URI for the SVG
    const base64 = Buffer.from(svgContent).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    console.warn('Could not load custom icon, using fallback');
    // Fallback to simple SVG
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="${DESIGN_CONFIG.COLORS.PRIMARY}"/>
        <circle cx="50" cy="50" r="20" fill="${DESIGN_CONFIG.COLORS.SECONDARY}"/>
      </svg>
    `).toString('base64')}`;
  }
}

export function generateQuoteTemplate(data: SanitizedQuoteData): string {
  const { coreValue, supportingValue, quote, author, style = 'style1' } = data;
  
  // Escape all content for HTML safety
  const safeData = {
    coreValue: escapeHtml(coreValue),
    supportingValue: escapeHtml(supportingValue),
    quote: escapeHtml(quote),
    author: author ? escapeHtml(author) : '',
  };

  // Generate template based on selected style
  switch (style) {
    case 'style1':
      return generateStyle1Template(safeData);
    case 'style2':
      return generateStyle2Template(safeData);
    default:
      return generateStyle1Template(safeData);
  }
}

function generateStyle1Template(safeData: {
  coreValue: string;
  supportingValue: string;
  quote: string;
  author: string;
}): string {
  const { coreValue, supportingValue, quote, author } = safeData;

  // Load the icon
  const iconDataUri = loadIconSvg();

  // Calculate responsive font sizes with better scaling
  const getCoreFontSize = (text: string) => {
    const baseSize = 57;
    const minSize = 36;
    if (text.length <= 15) return `${baseSize}px`;
    if (text.length <= 25) return `${Math.max(minSize, baseSize - 5)}px`;
    if (text.length <= 35) return `${Math.max(minSize, baseSize - 10)}px`;
    return `${Math.max(minSize, baseSize - 15)}px`;
  };
  
  const getSupportingFontSize = (text: string) => {
    const baseSize = 36;
    const minSize = 24;
    if (text.length <= 20) return `${baseSize}px`;
    if (text.length <= 30) return `${Math.max(minSize, baseSize - 4)}px`;
    if (text.length <= 40) return `${Math.max(minSize, baseSize - 8)}px`;
    return `${Math.max(minSize, baseSize - 12)}px`;
  };
  
  const getQuoteFontSize = (text: string) => {
    const baseSize = 84;
    const minSize = 42;
    if (text.length <= 50) return `${baseSize}px`;
    if (text.length <= 80) return `${Math.max(minSize, baseSize - 8)}px`;
    if (text.length <= 120) return `${Math.max(minSize, baseSize - 16)}px`;
    if (text.length <= 160) return `${Math.max(minSize, baseSize - 24)}px`;
    return `${Math.max(minSize, baseSize - 32)}px`;
  };
  
  const getAuthorFontSize = (text: string) => {
    const baseSize = 32;
    const minSize = 20;
    if (text.length <= 20) return `${baseSize}px`;
    if (text.length <= 30) return `${Math.max(minSize, baseSize - 4)}px`;
    return `${Math.max(minSize, baseSize - 8)}px`;
  };

  const coreFontSize = getCoreFontSize(coreValue);
  const supportingFontSize = getSupportingFontSize(supportingValue);
  const quoteFontSize = getQuoteFontSize(quote);
  const authorFontSize = author ? getAuthorFontSize(author) : '32px';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${FONT_IMPORTS.map(url => `@import url('${url}');`).join('\n        ')}
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0; 
          padding: 0; 
          width: ${DESIGN_CONFIG.IMAGE.WIDTH}px; 
          height: ${DESIGN_CONFIG.IMAGE.HEIGHT}px;
          background: ${DESIGN_CONFIG.COLORS.WHITE};
          display: flex; 
          justify-content: center; 
          align-items: center;
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
        }
        
        .container {
          width: ${DESIGN_CONFIG.IMAGE.CONTAINER_WIDTH}px; 
          height: ${DESIGN_CONFIG.IMAGE.CONTAINER_HEIGHT}px; 
          background: ${DESIGN_CONFIG.COLORS.WHITE};
          border: 5px solid ${DESIGN_CONFIG.COLORS.BORDER};
          padding: ${DESIGN_CONFIG.IMAGE.PADDING}px; 
          box-sizing: border-box;
          display: flex; 
          flex-direction: column; 
          justify-content: space-between;
          position: relative;
        }
        
        .header {
          text-align: center;
          margin-bottom: ${DESIGN_CONFIG.SPACING.HEADER_MARGIN};
          flex-shrink: 0;
        }
        
        .core-value {
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
          font-size: ${coreFontSize}; 
          font-weight: 400;
          color: ${DESIGN_CONFIG.COLORS.BLACK}; 
          margin-bottom: 12px; 
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .supporting-value {
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
          font-size: ${supportingFontSize}; 
          font-weight: 400; 
          color: ${DESIGN_CONFIG.COLORS.GRAY};
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .quote-section {
          flex: 1;
          display: flex; 
          flex-direction: column;
          justify-content: center; 
          text-align: center; 
          align-items: center;
          padding: 40px 20px;
        }
        
        .quote {
          font-family: ${DESIGN_CONFIG.FONTS.SECONDARY};
          font-size: ${quoteFontSize};
          font-weight: 400; 
          color: ${DESIGN_CONFIG.COLORS.BLACK}; 
          line-height: 1.1;
          margin-bottom: ${DESIGN_CONFIG.SPACING.QUOTE_MARGIN};
          font-style: normal;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 95%;
          word-wrap: break-word;
        }
        
        .author {
          font-family: ${DESIGN_CONFIG.FONTS.SECONDARY};
          font-size: ${authorFontSize}; 
          font-weight: 400; 
          color: ${DESIGN_CONFIG.COLORS.GRAY}; 
          text-align: right;
          font-style: italic;
          align-self: flex-end;
          max-width: 95%;
        }
        
        .footer {
          border-top: 2px solid ${DESIGN_CONFIG.COLORS.BORDER};
          padding-top: ${DESIGN_CONFIG.SPACING.FOOTER_PADDING};
          text-align: center;
          flex-shrink: 0;
        }
        
        .footer-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer-text { 
          font-family: ${DESIGN_CONFIG.FONTS.FOOTER};
          font-size: ${DESIGN_CONFIG.FONT_SIZES.FOOTER}; 
          color: ${DESIGN_CONFIG.COLORS.BLACK}; 
          font-weight: 400;
          text-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.03);
        }
        
        .dove-icon {
          margin-left: ${DESIGN_CONFIG.SPACING.ICON_MARGIN};
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .dove-svg {
          width: 35px;
          height: 35px;
          fill: ${DESIGN_CONFIG.COLORS.SECONDARY};
        }
        
        /* Ensure font loading */
        .font-preload {
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
          font-family: ${DESIGN_CONFIG.FONTS.SECONDARY};
          font-family: ${DESIGN_CONFIG.FONTS.FOOTER};
          visibility: hidden;
          position: absolute;
        }
      </style>
    </head>
    <body>
      <div class="font-preload">.</div>
      <div class="container">
        <div class="header">
          <div class="core-value">Core Value: ${coreValue}</div>
          <div class="supporting-value">Supporting Value: ${supportingValue}</div>
        </div>
        
        <div class="quote-section">
          <div class="quote">"${quote}"</div>
          ${author ? `<div class="author">— ${author}</div>` : ''}
        </div>
        
        <div class="footer">
          <div class="footer-content">
            <span class="footer-text">${DESIGN_CONFIG.BRAND.HANDLE}</span>
            <div class="dove-icon">
              <img class="dove-svg" src="${iconDataUri}" alt="Icon" />
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `.trim();
}

function generateStyle2Template(safeData: {
  coreValue: string;
  supportingValue: string;
  quote: string;
  author: string;
}): string {
  const { coreValue, supportingValue, quote, author } = safeData;

  // Calculate responsive font sizes for dark theme
  const getCoreFontSize = (text: string) => {
    const baseSize = 54;
    const minSize = 32;
    if (text.length <= 15) return `${baseSize}px`;
    if (text.length <= 25) return `${Math.max(minSize, baseSize - 4)}px`;
    if (text.length <= 35) return `${Math.max(minSize, baseSize - 8)}px`;
    return `${Math.max(minSize, baseSize - 12)}px`;
  };
  
  const getSupportingFontSize = (text: string) => {
    const baseSize = 32;
    const minSize = 20;
    if (text.length <= 20) return `${baseSize}px`;
    if (text.length <= 30) return `${Math.max(minSize, baseSize - 3)}px`;
    if (text.length <= 40) return `${Math.max(minSize, baseSize - 6)}px`;
    return `${Math.max(minSize, baseSize - 9)}px`;
  };
  
  const getQuoteFontSize = (text: string) => {
    const baseSize = 78;
    const minSize = 38;
    if (text.length <= 50) return `${baseSize}px`;
    if (text.length <= 80) return `${Math.max(minSize, baseSize - 8)}px`;
    if (text.length <= 120) return `${Math.max(minSize, baseSize - 16)}px`;
    if (text.length <= 160) return `${Math.max(minSize, baseSize - 24)}px`;
    return `${Math.max(minSize, baseSize - 32)}px`;
  };
  
  const getAuthorFontSize = (text: string) => {
    const baseSize = 28;
    const minSize = 18;
    if (text.length <= 20) return `${baseSize}px`;
    if (text.length <= 30) return `${Math.max(minSize, baseSize - 3)}px`;
    return `${Math.max(minSize, baseSize - 6)}px`;
  };

  const coreFontSize = getCoreFontSize(coreValue);
  const supportingFontSize = getSupportingFontSize(supportingValue);
  const quoteFontSize = getQuoteFontSize(quote);
  const authorFontSize = author ? getAuthorFontSize(author) : '28px';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${FONT_IMPORTS.map(url => `@import url('${url}');`).join('\n        ')}
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0; 
          padding: 0; 
          width: ${DESIGN_CONFIG.IMAGE.WIDTH}px; 
          height: ${DESIGN_CONFIG.IMAGE.HEIGHT}px;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          display: flex; 
          justify-content: center; 
          align-items: center;
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
        }
        
        .container {
          width: ${DESIGN_CONFIG.IMAGE.CONTAINER_WIDTH}px; 
          height: ${DESIGN_CONFIG.IMAGE.CONTAINER_HEIGHT}px; 
          background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #000000 100%);
          border: 2px solid #374151;
          border-radius: 24px;
          padding: ${DESIGN_CONFIG.IMAGE.PADDING}px; 
          box-sizing: border-box;
          display: flex; 
          flex-direction: column; 
          justify-content: space-between;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }
        
        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
          pointer-events: none;
        }
        
        .header {
          text-align: center;
          margin-bottom: 32px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        
        .header-accent {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        
        .accent-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin: 0 8px;
        }
        
        .accent-dot.red {
          background: #ef4444;
        }
        
        .accent-dot.cyan {
          background: #06b6d4;
        }
        
        .core-value {
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
          font-size: ${coreFontSize}; 
          font-weight: 300;
          color: #ffffff; 
          margin-bottom: 12px; 
          line-height: 1.2;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
          letter-spacing: 0.5px;
        }
        
        .supporting-value {
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
          font-size: ${supportingFontSize}; 
          font-weight: 300; 
          color: #9ca3af;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.25px;
        }
        
        .quote-section {
          flex: 1;
          display: flex; 
          flex-direction: column;
          justify-content: center; 
          text-align: center; 
          align-items: center;
          padding: 40px 20px;
          position: relative;
          z-index: 1;
        }
        
        .quote {
          font-family: ${DESIGN_CONFIG.FONTS.SECONDARY};
          font-size: ${quoteFontSize};
          font-weight: 300; 
          color: #ffffff; 
          line-height: 1.15;
          margin-bottom: 24px;
          font-style: italic;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
          max-width: 95%;
          word-wrap: break-word;
          position: relative;
        }
        
        .quote::before {
          content: '"';
          position: absolute;
          left: -20px;
          top: -10px;
          font-size: 72px;
          color: #fbbf24;
          opacity: 0.3;
          font-family: serif;
        }
        
        .author {
          font-family: ${DESIGN_CONFIG.FONTS.SECONDARY};
          font-size: ${authorFontSize}; 
          font-weight: 300; 
          color: #6b7280; 
          text-align: right;
          font-style: italic;
          align-self: flex-end;
          max-width: 95%;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .footer {
          border-top: 1px solid #374151;
          padding-top: 20px;
          text-align: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        
        .footer-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer-text { 
          font-family: ${DESIGN_CONFIG.FONTS.FOOTER};
          font-size: 18px; 
          color: #9ca3af; 
          font-weight: 300;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.5px;
        }
        
        .brand-icon {
          margin-left: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .brand-svg {
          width: 32px;
          height: 32px;
          fill: #fbbf24;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        
        .gradient-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(to right, transparent, #fbbf24, transparent);
          margin: 16px auto;
        }
        
        /* Ensure font loading */
        .font-preload {
          font-family: ${DESIGN_CONFIG.FONTS.PRIMARY};
          font-family: ${DESIGN_CONFIG.FONTS.SECONDARY};
          font-family: ${DESIGN_CONFIG.FONTS.FOOTER};
          visibility: hidden;
          position: absolute;
        }
      </style>
    </head>
    <body>
      <div class="font-preload">.</div>
      <div class="container">
        <div class="header">
          <div class="header-accent">
            <div class="accent-dot red"></div>
            <div class="gradient-line"></div>
            <div class="accent-dot cyan"></div>
          </div>
          <div class="core-value">${coreValue}</div>
          <div class="supporting-value">${supportingValue}</div>
        </div>
        
        <div class="quote-section">
          <div class="quote">${quote}</div>
          ${author ? `<div class="author">— ${author}</div>` : ''}
        </div>
        
        <div class="footer">
          <div class="footer-content">
            <span class="footer-text">${DESIGN_CONFIG.BRAND.HANDLE}</span>
            <div class="brand-icon">
              <svg class="brand-svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `.trim();
}