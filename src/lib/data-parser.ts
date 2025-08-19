import { nanoid } from 'nanoid';
import type {
  CoreValue,
  SupportingValue,
  Author,
  Quote,
  CoreValueSupportingValue,
  CoreValueQuote,
  DatabaseSchema
} from '@/types/database-relational';

interface ParsedCSVRow {
  coreValue: string;
  supportingValues: string[];
  quotes: string[];
  authors: string[];
}

interface QuoteAuthorPair {
  quote: string;
  author: string | null;
}

export function parseNotionCSV(csvContent: string): DatabaseSchema {
  const lines = csvContent.split('\n');
  
  // Parse each data row (skip header)
  const parsedRows: ParsedCSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const row = parseCSVRowImproved(line);
    if (row) {
      parsedRows.push(row);
    }
  }
  
  // Create entities and relationships
  const now = new Date();
  
  // Extract unique entities
  const coreValueSet = new Set<string>();
  const supportingValueSet = new Set<string>();
  const authorSet = new Set<string>();
  const quoteAuthorPairs: QuoteAuthorPair[] = [];
  
  // Collect all unique values and properly pair quotes with authors
  parsedRows.forEach(row => {
    coreValueSet.add(row.coreValue);
    row.supportingValues.forEach(sv => supportingValueSet.add(sv));
    
    // Smart quote-author pairing
    const pairs = pairQuotesWithAuthors(row.quotes, row.authors);
    pairs.forEach(pair => {
      quoteAuthorPairs.push(pair);
      if (pair.author && pair.author.trim()) {
        authorSet.add(pair.author);
      }
    });
  });
  
  // Create entity arrays
  const coreValues: CoreValue[] = Array.from(coreValueSet).map(value => ({
    id: nanoid(),
    value: cleanValue(value),
    description: getValueDescription(value),
    isActive: true,
    createdAt: now,
    updatedAt: now
  }));
  
  const supportingValues: SupportingValue[] = Array.from(supportingValueSet).map(value => ({
    id: nanoid(),
    value: cleanValue(value),
    description: getValueDescription(value),
    isActive: true,
    createdAt: now,
    updatedAt: now
  }));
  
  const authors: Author[] = Array.from(authorSet).map(name => ({
    id: nanoid(),
    name: cleanValue(name),
    isActive: true,
    createdAt: now,
    updatedAt: now
  }));
  
  // Create quotes with proper author relationships
  const quotes: Quote[] = [];
  const uniqueQuotes = new Set<string>();
  
  quoteAuthorPairs.forEach(pair => {
    const cleanQuote = cleanValue(pair.quote);
    if (!uniqueQuotes.has(cleanQuote)) {
      uniqueQuotes.add(cleanQuote);
      const author = pair.author ? authors.find(a => a.name === cleanValue(pair.author)) : undefined;
      
      quotes.push({
        id: nanoid(),
        text: cleanQuote,
        authorId: author?.id || null,
        category: categorizeQuote(cleanQuote),
        isActive: true,
        createdAt: now,
        updatedAt: now
      });
    }
  });
  
  // Create relationship arrays
  const coreValueSupportingValues: CoreValueSupportingValue[] = [];
  const coreValueQuotes: CoreValueQuote[] = [];
  
  parsedRows.forEach(row => {
    const coreValue = coreValues.find(cv => cv.value === cleanValue(row.coreValue));
    if (!coreValue) return;
    
    // Create core value -> supporting value relationships
    row.supportingValues.forEach(svValue => {
      const supportingValue = supportingValues.find(sv => sv.value === cleanValue(svValue));
      if (supportingValue) {
        const exists = coreValueSupportingValues.some(
          rel => rel.coreValueId === coreValue.id && rel.supportingValueId === supportingValue.id
        );
        if (!exists) {
          coreValueSupportingValues.push({
            id: nanoid(),
            coreValueId: coreValue.id,
            supportingValueId: supportingValue.id,
            createdAt: now
          });
        }
      }
    });
    
    // Create core value -> quote relationships
    row.quotes.forEach(quoteText => {
      const quote = quotes.find(q => q.text === cleanValue(quoteText));
      if (quote) {
        const exists = coreValueQuotes.some(
          rel => rel.coreValueId === coreValue.id && rel.quoteId === quote.id
        );
        if (!exists) {
          coreValueQuotes.push({
            id: nanoid(),
            coreValueId: coreValue.id,
            quoteId: quote.id,
            createdAt: now
          });
        }
      }
    });
  });
  
  return {
    coreValues,
    supportingValues,
    authors,
    quotes,
    coreValueSupportingValues,
    coreValueQuotes,
    quotePosts: []
  };
}

function parseCSVRowImproved(line: string): ParsedCSVRow | null {
  // Use proper CSV parsing to handle quoted content
  const parts = parseCSVLine(line);
  
  if (parts.length < 8) return null;
  
  const coreValueRaw = parts[2]; // "Core Value Roll" column
  const supportingValuesRaw = parts[4]; // "All Values Roll" column  
  const quotesRaw = parts[6]; // "Quotes Roll" column (clean quotes)
  const authorsRaw = parts[7]; // "Author Roll" column
  
  const coreValue = cleanValue(coreValueRaw);
  const supportingValues = supportingValuesRaw.split(',').map(cleanValue).filter(v => v);
  const quotes = parseQuotes(quotesRaw);
  const authors = parseAuthors(authorsRaw);
  
  return {
    coreValue,
    supportingValues,
    quotes,
    authors
  };
}

function parseQuotes(quotesRaw: string): string[] {
  if (!quotesRaw.trim()) return [];
  
  // Smart quote extraction: look for complete sentences ending with punctuation
  const quotes: string[] = [];
  let currentQuote = '';
  let i = 0;
  
  while (i < quotesRaw.length) {
    const char = quotesRaw[i];
    
    if (char === ',' && currentQuote.trim().match(/[.!?]$/)) {
      // This comma follows a sentence-ending punctuation, so it's likely a quote boundary
      const trimmed = currentQuote.trim();
      if (trimmed.length > 20) { // Must be substantial
        quotes.push(cleanValue(trimmed));
      }
      currentQuote = '';
    } else {
      currentQuote += char;
    }
    i++;
  }
  
  // Add the last quote
  const finalQuote = currentQuote.trim();
  if (finalQuote.length > 20) {
    quotes.push(cleanValue(finalQuote));
  }
  
  return quotes;
}

function parseAuthors(authorsRaw: string): string[] {
  if (!authorsRaw.trim()) return [];
  
  // DON'T filter out empty authors - we need to preserve positions!
  return authorsRaw.split(',')
    .map(author => author.trim()); // Just trim, don't filter or clean aggressively
}

function pairQuotesWithAuthors(quotes: string[], authors: string[]): QuoteAuthorPair[] {
  const pairs: QuoteAuthorPair[] = [];
  
  // Use POSITIONAL alignment, not sequential through non-empty authors
  quotes.forEach((quote, index) => {
    let author: string | null = null;
    
    // Check if there's an author at the same position
    if (index < authors.length) {
      const currentAuthor = authors[index];
      if (currentAuthor && currentAuthor.trim() && currentAuthor !== ' ') {
        author = currentAuthor;
      }
      // If empty/blank, author remains null (which is correct)
    }
    
    pairs.push({ quote, author });
  });
  
  return pairs;
}


function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
        continue;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      i++;
      continue;
    } else {
      current += char;
    }
    i++;
  }
  
  result.push(current);
  return result;
}

function cleanValue(value: string): string {
  if (!value) return '';
  
  return value
    .trim()
    .replace(/^["']+|["']+$/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

function getValueDescription(value: string): string {
  // Generate simple descriptions for core/supporting values
  const descriptions: Record<string, string> = {
    'Balance': 'Finding harmony and equilibrium in all aspects of life',
    'Contribution': 'Making a positive impact and serving others meaningfully',
    'Freedom': 'Liberation from limitations and the power to choose your path',
    'Growth': 'Continuous learning, development, and personal evolution',
    'Authenticity': 'Being true to your genuine self and living with integrity'
  };
  
  return descriptions[value] || `Embodying the principle of ${value.toLowerCase()}`;
}

function categorizeQuote(text: string): string {
  const lower = text.toLowerCase();
  
  if (lower.includes('love') || lower.includes('heart') || lower.includes('compassion')) {
    return 'Love & Compassion';
  } else if (lower.includes('fear') || lower.includes('courage') || lower.includes('strength')) {
    return 'Courage & Strength';
  } else if (lower.includes('wisdom') || lower.includes('knowledge') || lower.includes('learn')) {
    return 'Wisdom & Insight';
  } else if (lower.includes('grow') || lower.includes('change') || lower.includes('transform')) {
    return 'Growth & Transformation';
  } else if (lower.includes('peace') || lower.includes('calm') || lower.includes('present')) {
    return 'Peace & Presence';
  }
  
  return 'General Wisdom';
}