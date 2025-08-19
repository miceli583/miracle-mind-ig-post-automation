import DOMPurify from 'isomorphic-dompurify';

export interface SanitizedQuoteData {
  coreValue: string;
  supportingValue: string; 
  quote: string;
  author?: string;
  style?: string;
}

export function sanitizeQuoteData(data: {
  coreValue: string;
  supportingValue: string;
  quote: string;
  author?: string;
  style?: string;
}): SanitizedQuoteData {
  return {
    coreValue: sanitizeText(data.coreValue),
    supportingValue: sanitizeText(data.supportingValue),
    quote: sanitizeText(data.quote),
    author: data.author ? sanitizeText(data.author) : undefined,
    style: data.style || 'style1',
  };
}

function sanitizeText(text: string): string {
  // Remove HTML tags and decode entities
  const cleaned = DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  });
  
  // Additional sanitization for template literal injection
  return cleaned
    .replace(/[`${}\\]/g, '') // Remove template literal chars
    .replace(/[<>]/g, '')     // Remove any remaining angle brackets
    .trim();
}

export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return text.replace(/[&<>"'`=]/g, (match) => htmlEscapes[match] || match);
}