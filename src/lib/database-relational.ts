import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type {
  DatabaseSchema,
  CoreValue,
  SupportingValue,
  Author,
  Quote,
  QuotePost,
  QuotePostWithData,
  CoreValueWithRelations,
  QuoteWithAuthor,
  CoreValueSupportingValue,
  CoreValueQuote,
  CreateCoreValueInput,
  CreateSupportingValueInput,
  CreateAuthorInput,
  CreateQuoteInput,
  CreateQuotePostInput,
} from '@/types/database-relational';
import { parseNotionCSV } from './data-parser';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database-relational.json');

let cachedDb: DatabaseSchema | null = null;

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function loadDatabase(): Promise<DatabaseSchema> {
  if (cachedDb) return cachedDb;

  await ensureDataDirectory();

  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Convert date strings back to Date objects
    const convertDates = (obj: Record<string, unknown>) => {
      if (obj.createdAt && typeof obj.createdAt === 'string') obj.createdAt = new Date(obj.createdAt);
      if (obj.updatedAt && typeof obj.updatedAt === 'string') obj.updatedAt = new Date(obj.updatedAt);
      if (obj.publishedAt && typeof obj.publishedAt === 'string') obj.publishedAt = new Date(obj.publishedAt);
      if (obj.scheduledFor && typeof obj.scheduledFor === 'string') obj.scheduledFor = new Date(obj.scheduledFor);
      return obj;
    };
    
    parsed.coreValues = parsed.coreValues?.map(convertDates) || [];
    parsed.supportingValues = parsed.supportingValues?.map(convertDates) || [];
    parsed.authors = parsed.authors?.map(convertDates) || [];
    parsed.quotes = parsed.quotes?.map(convertDates) || [];
    parsed.quotePosts = parsed.quotePosts?.map(convertDates) || [];
    parsed.coreValueSupportingValues = parsed.coreValueSupportingValues?.map(convertDates) || [];
    parsed.coreValueQuotes = parsed.coreValueQuotes?.map(convertDates) || [];
    
    cachedDb = parsed;
    return cachedDb!;
  } catch {
    // Initialize with empty database if file doesn't exist
    const defaultDb: DatabaseSchema = {
      coreValues: [],
      supportingValues: [],
      authors: [],
      quotes: [],
      coreValueSupportingValues: [],
      coreValueQuotes: [],
      quotePosts: [],
    };
    await saveDatabase(defaultDb);
    cachedDb = defaultDb;
    return defaultDb;
  }
}

async function saveDatabase(db: DatabaseSchema): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
  cachedDb = db;
}

// Core Values
export async function getCoreValues(): Promise<CoreValue[]> {
  const db = await loadDatabase();
  return db.coreValues.filter(cv => cv.isActive);
}

export async function getCoreValueWithRelations(id: string): Promise<CoreValueWithRelations | null> {
  const db = await loadDatabase();
  const coreValue = db.coreValues.find(cv => cv.id === id && cv.isActive);
  
  if (!coreValue) return null;
  
  // Get related supporting values
  const supportingValueIds = db.coreValueSupportingValues
    .filter(rel => rel.coreValueId === id)
    .map(rel => rel.supportingValueId);
  
  const supportingValues = db.supportingValues.filter(sv => 
    supportingValueIds.includes(sv.id) && sv.isActive
  );
  
  // Get related quotes with authors
  const quoteIds = db.coreValueQuotes
    .filter(rel => rel.coreValueId === id)
    .map(rel => rel.quoteId);
  
  const quotes: QuoteWithAuthor[] = db.quotes
    .filter(q => quoteIds.includes(q.id) && q.isActive)
    .map(quote => ({
      ...quote,
      author: quote.authorId ? db.authors.find(a => a.id === quote.authorId && a.isActive) : undefined
    }));
  
  return {
    ...coreValue,
    supportingValues,
    quotes
  };
}

export async function createCoreValue(input: CreateCoreValueInput): Promise<CoreValue> {
  const db = await loadDatabase();
  const now = new Date();
  const coreValue: CoreValue = {
    id: nanoid(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  db.coreValues.push(coreValue);
  await saveDatabase(db);
  return coreValue;
}

export async function updateCoreValue(id: string, input: Partial<CreateCoreValueInput>): Promise<CoreValue | null> {
  const db = await loadDatabase();
  const index = db.coreValues.findIndex(cv => cv.id === id);
  
  if (index === -1) return null;
  
  const now = new Date();
  db.coreValues[index] = {
    ...db.coreValues[index],
    ...input,
    updatedAt: now,
  };
  
  await saveDatabase(db);
  return db.coreValues[index];
}

export async function archiveCoreValue(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.coreValues.findIndex(cv => cv.id === id);
  
  if (index === -1) return false;
  
  const now = new Date();
  db.coreValues[index] = {
    ...db.coreValues[index],
    isActive: false,
    updatedAt: now,
  };
  
  await saveDatabase(db);
  return true;
}

export async function deleteCoreValue(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.coreValues.findIndex(cv => cv.id === id);
  
  if (index === -1) return false;
  
  // Remove the core value
  db.coreValues.splice(index, 1);
  
  // Remove all relationships with supporting values
  db.coreValueSupportingValues = db.coreValueSupportingValues.filter(
    rel => rel.coreValueId !== id
  );
  
  // Remove all relationships with quotes
  db.coreValueQuotes = db.coreValueQuotes.filter(
    rel => rel.coreValueId !== id
  );
  
  await saveDatabase(db);
  return true;
}

// Supporting Values
export async function getSupportingValues(): Promise<SupportingValue[]> {
  const db = await loadDatabase();
  return db.supportingValues.filter(sv => sv.isActive);
}

export async function getSupportingValuesForCore(coreValueId: string): Promise<SupportingValue[]> {
  const db = await loadDatabase();
  const supportingValueIds = db.coreValueSupportingValues
    .filter(rel => rel.coreValueId === coreValueId)
    .map(rel => rel.supportingValueId);
  
  return db.supportingValues.filter(sv => 
    supportingValueIds.includes(sv.id) && sv.isActive
  );
}

export async function createSupportingValue(input: CreateSupportingValueInput & { coreValueId?: string; coreValueIds?: string[] }): Promise<SupportingValue> {
  const db = await loadDatabase();
  const now = new Date();
  
  // Extract coreValueId(s) from input before creating supporting value
  const { coreValueId, coreValueIds, ...supportingValueData } = input;
  
  const supportingValue: SupportingValue = {
    id: nanoid(),
    ...supportingValueData,
    createdAt: now,
    updatedAt: now,
  };
  
  db.supportingValues.push(supportingValue);
  
  // Create relationships for multiple core values
  const coreValueIdsToLink = coreValueIds || (coreValueId ? [coreValueId] : []);
  
  for (const cvId of coreValueIdsToLink) {
    const relationship: CoreValueSupportingValue = {
      id: nanoid(),
      coreValueId: cvId,
      supportingValueId: supportingValue.id,
      createdAt: now,
    };
    db.coreValueSupportingValues.push(relationship);
  }
  
  await saveDatabase(db);
  return supportingValue;
}

export async function updateSupportingValue(id: string, input: Partial<CreateSupportingValueInput> & { coreValueIds?: string[] }): Promise<SupportingValue | null> {
  const db = await loadDatabase();
  const index = db.supportingValues.findIndex(sv => sv.id === id);
  
  if (index === -1) return null;
  
  const now = new Date();
  const { coreValueIds, ...supportingValueData } = input;
  
  // Update the supporting value
  db.supportingValues[index] = {
    ...db.supportingValues[index],
    ...supportingValueData,
    updatedAt: now,
  };
  
  // Update relationships if coreValueIds provided
  if (coreValueIds !== undefined) {
    // Remove existing relationships
    db.coreValueSupportingValues = db.coreValueSupportingValues.filter(
      rel => rel.supportingValueId !== id
    );
    
    // Add new relationships
    for (const coreValueId of coreValueIds) {
      const relationship: CoreValueSupportingValue = {
        id: nanoid(),
        coreValueId,
        supportingValueId: id,
        createdAt: now,
      };
      db.coreValueSupportingValues.push(relationship);
    }
  }
  
  await saveDatabase(db);
  return db.supportingValues[index];
}

export async function archiveSupportingValue(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.supportingValues.findIndex(sv => sv.id === id);
  
  if (index === -1) return false;
  
  const now = new Date();
  db.supportingValues[index] = {
    ...db.supportingValues[index],
    isActive: false,
    updatedAt: now,
  };
  
  await saveDatabase(db);
  return true;
}

export async function deleteSupportingValue(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.supportingValues.findIndex(sv => sv.id === id);
  
  if (index === -1) return false;
  
  // Remove the supporting value
  db.supportingValues.splice(index, 1);
  
  // Remove all relationships with core values
  db.coreValueSupportingValues = db.coreValueSupportingValues.filter(
    rel => rel.supportingValueId !== id
  );
  
  await saveDatabase(db);
  return true;
}

export async function createCoreValueSupportingValueRelation(coreValueId: string, supportingValueId: string): Promise<CoreValueSupportingValue> {
  const db = await loadDatabase();
  const now = new Date();
  
  // Check if relationship already exists
  const existingRelation = db.coreValueSupportingValues.find(
    rel => rel.coreValueId === coreValueId && rel.supportingValueId === supportingValueId
  );
  
  if (existingRelation) {
    return existingRelation;
  }
  
  const relationship: CoreValueSupportingValue = {
    id: nanoid(),
    coreValueId,
    supportingValueId,
    createdAt: now,
  };
  
  db.coreValueSupportingValues.push(relationship);
  await saveDatabase(db);
  return relationship;
}

// Authors
export async function getAuthors(): Promise<Author[]> {
  const db = await loadDatabase();
  return db.authors.filter(a => a.isActive);
}

export async function createAuthor(input: CreateAuthorInput): Promise<Author> {
  const db = await loadDatabase();
  const now = new Date();
  const author: Author = {
    id: nanoid(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  db.authors.push(author);
  await saveDatabase(db);
  return author;
}

// Quotes
export async function getQuotes(): Promise<QuoteWithAuthor[]> {
  const db = await loadDatabase();
  return db.quotes
    .filter(q => q.isActive)
    .map(quote => ({
      ...quote,
      author: quote.authorId ? db.authors.find(a => a.id === quote.authorId && a.isActive) : undefined
    }));
}

export async function getQuotesForCore(coreValueId: string): Promise<QuoteWithAuthor[]> {
  const db = await loadDatabase();
  const quoteIds = db.coreValueQuotes
    .filter(rel => rel.coreValueId === coreValueId)
    .map(rel => rel.quoteId);
  
  return db.quotes
    .filter(q => quoteIds.includes(q.id) && q.isActive)
    .map(quote => ({
      ...quote,
      author: quote.authorId ? db.authors.find(a => a.id === quote.authorId && a.isActive) : undefined
    }));
}

export async function createQuote(input: CreateQuoteInput & { coreValueId?: string; coreValueIds?: string[] }): Promise<Quote> {
  const db = await loadDatabase();
  const now = new Date();
  
  // Extract coreValueId(s) from input before creating quote
  const { coreValueId, coreValueIds, ...quoteData } = input;
  
  const quote: Quote = {
    id: nanoid(),
    ...quoteData,
    createdAt: now,
    updatedAt: now,
  };
  
  db.quotes.push(quote);
  
  // Create relationships for multiple core values
  const coreValueIdsToLink = coreValueIds || (coreValueId ? [coreValueId] : []);
  
  for (const cvId of coreValueIdsToLink) {
    const relationship: CoreValueQuote = {
      id: nanoid(),
      coreValueId: cvId,
      quoteId: quote.id,
      createdAt: now,
    };
    db.coreValueQuotes.push(relationship);
  }
  
  await saveDatabase(db);
  return quote;
}

export async function updateQuote(id: string, input: Partial<CreateQuoteInput> & { coreValueIds?: string[] }): Promise<Quote | null> {
  const db = await loadDatabase();
  const now = new Date();
  
  // Extract coreValueIds from input
  const { coreValueIds, ...updateData } = input;
  
  // Find and update the quote
  const quoteIndex = db.quotes.findIndex(q => q.id === id);
  if (quoteIndex === -1) {
    return null;
  }
  
  // Update quote data
  db.quotes[quoteIndex] = {
    ...db.quotes[quoteIndex],
    ...updateData,
    updatedAt: now,
  };
  
  // Update core value relationships if provided
  if (coreValueIds !== undefined) {
    // Remove existing relationships
    db.coreValueQuotes = db.coreValueQuotes.filter(rel => rel.quoteId !== id);
    
    // Add new relationships
    for (const cvId of coreValueIds) {
      const relationship: CoreValueQuote = {
        id: nanoid(),
        coreValueId: cvId,
        quoteId: id,
        createdAt: now,
      };
      db.coreValueQuotes.push(relationship);
    }
  }
  
  await saveDatabase(db);
  return db.quotes[quoteIndex];
}

export async function archiveQuote(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const quoteIndex = db.quotes.findIndex(q => q.id === id);
  
  if (quoteIndex === -1) {
    return false;
  }
  
  db.quotes[quoteIndex] = {
    ...db.quotes[quoteIndex],
    isActive: false,
    updatedAt: new Date(),
  };
  
  await saveDatabase(db);
  return true;
}

export async function deleteQuote(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const quoteIndex = db.quotes.findIndex(q => q.id === id);
  
  if (quoteIndex === -1) {
    return false;
  }
  
  // Remove the quote
  db.quotes.splice(quoteIndex, 1);
  
  // Remove all related core value relationships
  db.coreValueQuotes = db.coreValueQuotes.filter(cvq => cvq.quoteId !== id);
  
  // Remove any quote posts that reference this quote
  db.quotePosts = db.quotePosts.filter(qp => qp.quoteId !== id);
  
  await saveDatabase(db);
  return true;
}

// Quote Posts
export async function getQuotePosts(): Promise<QuotePostWithData[]> {
  const db = await loadDatabase();
  
  const validQuotePosts: QuotePostWithData[] = [];
  
  for (const qp of db.quotePosts) {
    const coreValue = db.coreValues.find(cv => cv.id === qp.coreValueId);
    const supportingValue = db.supportingValues.find(sv => sv.id === qp.supportingValueId);
    const quote = db.quotes.find(q => q.id === qp.quoteId);
    const author = quote?.authorId ? db.authors.find(a => a.id === quote.authorId) : undefined;
    
    // Skip posts with missing references instead of throwing errors
    if (!coreValue || !supportingValue || !quote) {
      console.warn(`Skipping invalid quote post ${qp.id}: missing referenced data`);
      continue;
    }
    
    validQuotePosts.push({
      ...qp,
      coreValue,
      supportingValue,
      quote: {
        ...quote,
        author
      }
    });
  }
  
  return validQuotePosts;
}

export async function createQuotePost(input: CreateQuotePostInput): Promise<QuotePost> {
  const db = await loadDatabase();
  const now = new Date();
  const quotePost: QuotePost = {
    id: nanoid(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  db.quotePosts.push(quotePost);
  await saveDatabase(db);
  return quotePost;
}

export async function getRandomQuotePostData(): Promise<{
  coreValue: CoreValue;
  supportingValue: SupportingValue;
  quote: QuoteWithAuthor;
} | null> {
  const db = await loadDatabase();
  
  // Get all active core values
  const activeCoreValues = db.coreValues.filter(cv => cv.isActive);
  if (activeCoreValues.length === 0) {
    console.log('No active core values found');
    return null;
  }
  
  // Pick a random core value
  const randomCoreValue = activeCoreValues[Math.floor(Math.random() * activeCoreValues.length)];
  console.log('Selected core value:', randomCoreValue.value);
  
  // Get supporting values for this core value
  const supportingValueIds = db.coreValueSupportingValues
    .filter(rel => rel.coreValueId === randomCoreValue.id)
    .map(rel => rel.supportingValueId);
  
  console.log('Core-Supporting relationships found:', db.coreValueSupportingValues.length);
  console.log('Supporting value IDs for core:', supportingValueIds);
  
  const availableSupportingValues = db.supportingValues.filter(sv => 
    supportingValueIds.includes(sv.id) && sv.isActive
  );
  
  if (availableSupportingValues.length === 0) {
    console.log('No supporting values found for core value:', randomCoreValue.value);
    return null;
  }
  
  // Pick a random supporting value
  const randomSupportingValue = availableSupportingValues[Math.floor(Math.random() * availableSupportingValues.length)];
  
  // Get quotes for this core value
  const quoteIds = db.coreValueQuotes
    .filter(rel => rel.coreValueId === randomCoreValue.id)
    .map(rel => rel.quoteId);
  
  console.log('Core-Quote relationships found:', db.coreValueQuotes.length);
  console.log('Quote IDs for core:', quoteIds);
  
  const availableQuotes = db.quotes.filter(q => quoteIds.includes(q.id) && q.isActive);
  
  if (availableQuotes.length === 0) {
    console.log('No quotes found for core value:', randomCoreValue.value);
    return null;
  }
  
  // Pick a random quote
  const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  const author = randomQuote.authorId ? db.authors.find(a => a.id === randomQuote.authorId && a.isActive) : undefined;
  
  return {
    coreValue: randomCoreValue,
    supportingValue: randomSupportingValue,
    quote: {
      ...randomQuote,
      author
    }
  };
}

// Data seeding
export async function seedFromNotionCSV(): Promise<void> {
  try {
    const csvPath = path.join(process.cwd(), 'Core Values 24b036b75a3e80b28544f94f797a6711_all.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const parsedData = parseNotionCSV(csvContent);
    
    await saveDatabase(parsedData);
    console.log('Successfully seeded database from Notion CSV');
  } catch (error) {
    console.error('Failed to seed from CSV:', error);
    throw error;
  }
}

export async function seedDatabase(): Promise<void> {
  const db = await loadDatabase();
  
  // Only seed if database is empty
  if (db.coreValues.length > 0 || db.supportingValues.length > 0 || db.quotes.length > 0) {
    return;
  }
  
  // Try to seed from CSV first, fall back to sample data
  try {
    await seedFromNotionCSV();
  } catch {
    // Fallback to sample data
    const now = new Date();
    
    const sampleCoreValues: CoreValue[] = [
      { id: nanoid(), value: 'Growth', description: 'Personal development and learning', isActive: true, createdAt: now, updatedAt: now },
      { id: nanoid(), value: 'Balance', description: 'Finding harmony in life', isActive: true, createdAt: now, updatedAt: now },
      { id: nanoid(), value: 'Authenticity', description: 'Being true to yourself', isActive: true, createdAt: now, updatedAt: now },
    ];
    
    const sampleSupportingValues: SupportingValue[] = [
      { id: nanoid(), value: 'Curiosity', description: 'Eagerness to learn and explore', isActive: true, createdAt: now, updatedAt: now },
      { id: nanoid(), value: 'Patience', description: 'Ability to wait and persevere', isActive: true, createdAt: now, updatedAt: now },
      { id: nanoid(), value: 'Courage', description: 'Strength to face challenges', isActive: true, createdAt: now, updatedAt: now },
    ];
    
    const sampleAuthors: Author[] = [
      { id: nanoid(), name: 'Ralph Waldo Emerson', isActive: true, createdAt: now, updatedAt: now },
      { id: nanoid(), name: 'Maya Angelou', isActive: true, createdAt: now, updatedAt: now },
    ];
    
    const sampleQuotes: Quote[] = [
      { 
        id: nanoid(), 
        text: 'The only person you are destined to become is the person you decide to be.', 
        authorId: sampleAuthors[0].id,
        isActive: true, 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: nanoid(), 
        text: 'If you don\'t like something, change it. If you can\'t change it, change your attitude.', 
        authorId: sampleAuthors[1].id,
        isActive: true, 
        createdAt: now, 
        updatedAt: now 
      },
    ];
    
    const sampleData: DatabaseSchema = {
      coreValues: sampleCoreValues,
      supportingValues: sampleSupportingValues,
      authors: sampleAuthors,
      quotes: sampleQuotes,
      coreValueSupportingValues: [
        { id: nanoid(), coreValueId: sampleCoreValues[0].id, supportingValueId: sampleSupportingValues[0].id, createdAt: now },
        { id: nanoid(), coreValueId: sampleCoreValues[1].id, supportingValueId: sampleSupportingValues[1].id, createdAt: now },
      ],
      coreValueQuotes: [
        { id: nanoid(), coreValueId: sampleCoreValues[0].id, quoteId: sampleQuotes[0].id, createdAt: now },
        { id: nanoid(), coreValueId: sampleCoreValues[2].id, quoteId: sampleQuotes[1].id, createdAt: now },
      ],
      quotePosts: []
    };
    
    await saveDatabase(sampleData);
  }
}