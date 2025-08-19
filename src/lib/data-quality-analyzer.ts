import { parseNotionCSV } from './data-parser';
import fs from 'fs/promises';
import path from 'path';

interface QualityReport {
  coreValues: Array<{
    value: string;
    supportingValues: string[];
    quotes: Array<{
      text: string;
      author: string;
      quality: 'good' | 'needs_review' | 'archive';
      issues?: string[];
    }>;
  }>;
  recommendations: {
    archive: string[];
    needsReview: string[];
    duplicates: string[];
  };
}

export async function analyzeDataQuality(): Promise<QualityReport> {
  const csvPath = path.join(process.cwd(), 'Core Values 24b036b75a3e80b28544f94f797a6711_all.csv');
  const csvContent = await fs.readFile(csvPath, 'utf-8');
  const parsedData = parseNotionCSV(csvContent);
  
  const report: QualityReport = {
    coreValues: [],
    recommendations: {
      archive: [],
      needsReview: [],
      duplicates: []
    }
  };
  
  // Group data by core values for analysis
  const coreValueMap = new Map();
  
  parsedData.coreValues.forEach(cv => {
    const supportingValueIds = parsedData.coreValueSupportingValues
      .filter(rel => rel.coreValueId === cv.id)
      .map(rel => rel.supportingValueId);
    
    const supportingValues = parsedData.supportingValues
      .filter(sv => supportingValueIds.includes(sv.id))
      .map(sv => sv.value);
    
    const quoteIds = parsedData.coreValueQuotes
      .filter(rel => rel.coreValueId === cv.id)
      .map(rel => rel.quoteId);
    
    const quotes = parsedData.quotes
      .filter(q => quoteIds.includes(q.id))
      .map(quote => {
        const author = quote.authorId ? 
          parsedData.authors.find(a => a.id === quote.authorId)?.name || '' : '';
        
        const quality = assessQuoteQuality(quote.text, author, cv.value);
        
        return {
          text: quote.text,
          author,
          quality: quality.rating,
          issues: quality.issues
        };
      });
    
    coreValueMap.set(cv.value, {
      value: cv.value,
      supportingValues,
      quotes
    });
  });
  
  report.coreValues = Array.from(coreValueMap.values());
  
  // Generate recommendations
  report.coreValues.forEach(cv => {
    cv.quotes.forEach(quote => {
      if (quote.quality === 'archive') {
        report.recommendations.archive.push(`"${quote.text}" - ${quote.issues?.join(', ')}`);
      } else if (quote.quality === 'needs_review') {
        report.recommendations.needsReview.push(`"${quote.text}" - ${quote.issues?.join(', ')}`);
      }
    });
  });
  
  return report;
}

function assessQuoteQuality(text: string, author: string, coreValue: string): {
  rating: 'good' | 'needs_review' | 'archive';
  issues: string[];
} {
  const issues: string[] = [];
  let rating: 'good' | 'needs_review' | 'archive' = 'good';
  
  // Check for overly long quotes (might be too verbose for social media)
  if (text.length > 200) {
    issues.push('Too long for social media');
    rating = 'needs_review';
  }
  
  // Check for very short quotes (might lack substance)
  if (text.length < 20) {
    issues.push('Too short, lacks substance');
    rating = 'needs_review';
  }
  
  // Check for religious references that might be too specific
  const religiousTerms = ['God', 'Divine', 'Christ', 'Jesus', 'Bible', 'Scripture', 'Prayer'];
  const hasReligiousTerms = religiousTerms.some(term => text.includes(term));
  if (hasReligiousTerms) {
    issues.push('Contains specific religious references');
    rating = 'needs_review';
  }
  
  // Check for overly complex or academic language
  const complexWords = ['manifestations', 'relinquishment', 'episodic', 'ontological'];
  const hasComplexTerms = complexWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
  if (hasComplexTerms) {
    issues.push('May be too academic/complex');
    rating = 'needs_review';
  }
  
  // Check for incomplete sentences or formatting issues
  if (!text.trim().endsWith('.') && !text.trim().endsWith('?') && !text.trim().endsWith('!')) {
    issues.push('Incomplete sentence');
    rating = 'needs_review';
  }
  
  // Check for very specific internal references
  if (text.includes('Gene Keys') || text.includes('Course in Miracles') || text.includes('Notion')) {
    issues.push('Contains specific book/system references');
    rating = 'needs_review';
  }
  
  // Check for author attribution issues
  if (!author || author.trim() === '') {
    issues.push('Missing author attribution');
    rating = 'needs_review';
  }
  
  // Check for quotes that don't seem to relate to the core value
  const coreValueTerms = getCoreValueKeywords(coreValue);
  const hasRelatedTerms = coreValueTerms.some(term => 
    text.toLowerCase().includes(term.toLowerCase())
  );
  
  if (!hasRelatedTerms && text.length > 50) {
    issues.push(`May not relate clearly to ${coreValue}`);
    rating = 'needs_review';
  }
  
  return { rating, issues };
}

function getCoreValueKeywords(coreValue: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'Balance': ['balance', 'harmony', 'equilibrium', 'peace', 'flow', 'stability', 'center'],
    'Growth': ['grow', 'develop', 'learn', 'evolve', 'progress', 'expand', 'journey', 'change'],
    'Freedom': ['free', 'choice', 'liberty', 'independence', 'courage', 'path', 'decide'],
    'Contribution': ['give', 'serve', 'help', 'love', 'connect', 'community', 'share', 'impact'],
    'Authenticity': ['true', 'authentic', 'genuine', 'self', 'honest', 'real', 'essence', 'nature']
  };
  
  return keywordMap[coreValue] || [];
}

export async function generateCleanedData() {
  const report = await analyzeDataQuality();
  
  console.log('=== DATA QUALITY REPORT ===\n');
  
  report.coreValues.forEach(cv => {
    console.log(`Core Value: ${cv.value}`);
    console.log(`Supporting Values: ${cv.supportingValues.join(', ')}`);
    console.log(`Total Quotes: ${cv.quotes.length}`);
    
    const goodQuotes = cv.quotes.filter(q => q.quality === 'good');
    const reviewQuotes = cv.quotes.filter(q => q.quality === 'needs_review');
    const archiveQuotes = cv.quotes.filter(q => q.quality === 'archive');
    
    console.log(`Good Quotes: ${goodQuotes.length}`);
    console.log(`Need Review: ${reviewQuotes.length}`);
    console.log(`Archive: ${archiveQuotes.length}`);
    console.log('---\n');
  });
  
  console.log('=== RECOMMENDATIONS ===\n');
  console.log('ARCHIVE (too problematic for public use):');
  report.recommendations.archive.forEach(item => console.log(`- ${item}`));
  
  console.log('\nNEEDS REVIEW (might work with editing):');
  report.recommendations.needsReview.forEach(item => console.log(`- ${item}`));
  
  return report;
}