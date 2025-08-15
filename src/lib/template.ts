import { DESIGN_CONFIG, FONT_IMPORTS } from '@/config/design';
import { SanitizedQuoteData, escapeHtml } from './sanitization';

export function generateQuoteTemplate(data: SanitizedQuoteData): string {
  const { coreValue, supportingValue, quote, author } = data;
  
  // Escape all content for HTML safety
  const safeData = {
    coreValue: escapeHtml(coreValue),
    supportingValue: escapeHtml(supportingValue),
    quote: escapeHtml(quote),
    author: author ? escapeHtml(author) : '',
  };

  // Calculate responsive font sizes
  const coreFontSize = coreValue.length > 20 
    ? DESIGN_CONFIG.FONT_SIZES.CORE_VALUE.LONG 
    : DESIGN_CONFIG.FONT_SIZES.CORE_VALUE.DEFAULT;
    
  const quoteFontSize = 
    quote.length > 100 ? DESIGN_CONFIG.FONT_SIZES.QUOTE.LONG :
    quote.length > 60 ? DESIGN_CONFIG.FONT_SIZES.QUOTE.MEDIUM :
    DESIGN_CONFIG.FONT_SIZES.QUOTE.SHORT;

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
          font-size: ${DESIGN_CONFIG.FONT_SIZES.SUPPORTING_VALUE}; 
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
          font-size: ${DESIGN_CONFIG.FONT_SIZES.AUTHOR}; 
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
          width: ${DESIGN_CONFIG.BRAND.ICON_SIZE};
          height: ${DESIGN_CONFIG.BRAND.ICON_SIZE};
          background: ${DESIGN_CONFIG.COLORS.PRIMARY};
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .dove-svg {
          width: ${DESIGN_CONFIG.BRAND.ICON_SVG_SIZE};
          height: ${DESIGN_CONFIG.BRAND.ICON_SVG_SIZE};
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
              <svg class="dove-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 50 Q30 30, 50 35 Q70 30, 80 50 Q75 40, 65 45 Q70 50, 75 60 Q70 70, 60 65 Q50 70, 40 65 Q30 70, 25 60 Q30 50, 20 50 Z" fill="${DESIGN_CONFIG.COLORS.SECONDARY}"/>
                <circle cx="65" cy="45" r="3" fill="${DESIGN_CONFIG.COLORS.PRIMARY}"/>
                <path d="M45 50 Q50 45, 55 50 Q60 55, 65 50 Q70 55, 75 60" stroke="${DESIGN_CONFIG.COLORS.PRIMARY}" stroke-width="2" fill="none"/>
                <path d="M35 55 Q40 50, 45 55 Q50 60, 55 55" stroke="${DESIGN_CONFIG.COLORS.PRIMARY}" stroke-width="2" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `.trim();
}