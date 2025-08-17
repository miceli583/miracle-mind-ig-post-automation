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
  const { coreValue, supportingValue, quote, author } = data;
  
  // Escape all content for HTML safety
  const safeData = {
    coreValue: escapeHtml(coreValue),
    supportingValue: escapeHtml(supportingValue),
    quote: escapeHtml(quote),
    author: author ? escapeHtml(author) : '',
  };

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
          <div class="core-value">Core Value: ${safeData.coreValue}</div>
          <div class="supporting-value">Supporting Value: ${safeData.supportingValue}</div>
        </div>
        
        <div class="quote-section">
          <div class="quote">"${safeData.quote}"</div>
          ${safeData.author ? `<div class="author">— ${safeData.author}</div>` : ''}
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