import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import type {
  DatabaseSchema,
  CoreValue,
  SupportingValue,
  Quote,
  QuotePost,
  QuotePostWithData,
  CreateCoreValueInput,
  UpdateCoreValueInput,
  CreateSupportingValueInput,
  UpdateSupportingValueInput,
  CreateQuoteInput,
  UpdateQuoteInput,
  CreateQuotePostInput,
  UpdateQuotePostInput,
} from '@/types/database';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

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
    cachedDb = JSON.parse(data);
    return cachedDb!;
  } catch {
    // Initialize with empty database if file doesn't exist
    const defaultDb: DatabaseSchema = {
      coreValues: [],
      supportingValues: [],
      quotes: [],
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

export async function updateCoreValue(id: string, input: UpdateCoreValueInput): Promise<CoreValue | null> {
  const db = await loadDatabase();
  const index = db.coreValues.findIndex(cv => cv.id === id);
  
  if (index === -1) return null;
  
  const updated = {
    ...db.coreValues[index],
    ...input,
    updatedAt: new Date(),
  };
  
  db.coreValues[index] = updated;
  await saveDatabase(db);
  return updated;
}

export async function deleteCoreValue(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.coreValues.findIndex(cv => cv.id === id);
  
  if (index === -1) return false;
  
  // Soft delete by setting isActive to false
  db.coreValues[index].isActive = false;
  db.coreValues[index].updatedAt = new Date();
  await saveDatabase(db);
  return true;
}

// Supporting Values
export async function getSupportingValues(): Promise<SupportingValue[]> {
  const db = await loadDatabase();
  return db.supportingValues.filter(sv => sv.isActive);
}

export async function createSupportingValue(input: CreateSupportingValueInput): Promise<SupportingValue> {
  const db = await loadDatabase();
  const now = new Date();
  const supportingValue: SupportingValue = {
    id: nanoid(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  db.supportingValues.push(supportingValue);
  await saveDatabase(db);
  return supportingValue;
}

export async function updateSupportingValue(id: string, input: UpdateSupportingValueInput): Promise<SupportingValue | null> {
  const db = await loadDatabase();
  const index = db.supportingValues.findIndex(sv => sv.id === id);
  
  if (index === -1) return null;
  
  const updated = {
    ...db.supportingValues[index],
    ...input,
    updatedAt: new Date(),
  };
  
  db.supportingValues[index] = updated;
  await saveDatabase(db);
  return updated;
}

export async function deleteSupportingValue(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.supportingValues.findIndex(sv => sv.id === id);
  
  if (index === -1) return false;
  
  // Soft delete by setting isActive to false
  db.supportingValues[index].isActive = false;
  db.supportingValues[index].updatedAt = new Date();
  await saveDatabase(db);
  return true;
}

// Quotes
export async function getQuotes(): Promise<Quote[]> {
  const db = await loadDatabase();
  return db.quotes.filter(q => q.isActive);
}

export async function createQuote(input: CreateQuoteInput): Promise<Quote> {
  const db = await loadDatabase();
  const now = new Date();
  const quote: Quote = {
    id: nanoid(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  db.quotes.push(quote);
  await saveDatabase(db);
  return quote;
}

export async function updateQuote(id: string, input: UpdateQuoteInput): Promise<Quote | null> {
  const db = await loadDatabase();
  const index = db.quotes.findIndex(q => q.id === id);
  
  if (index === -1) return null;
  
  const updated = {
    ...db.quotes[index],
    ...input,
    updatedAt: new Date(),
  };
  
  db.quotes[index] = updated;
  await saveDatabase(db);
  return updated;
}

export async function deleteQuote(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.quotes.findIndex(q => q.id === id);
  
  if (index === -1) return false;
  
  // Soft delete by setting isActive to false
  db.quotes[index].isActive = false;
  db.quotes[index].updatedAt = new Date();
  await saveDatabase(db);
  return true;
}

// Quote Posts
export async function getQuotePosts(): Promise<QuotePostWithData[]> {
  const db = await loadDatabase();
  
  return db.quotePosts.map(qp => {
    const coreValue = db.coreValues.find(cv => cv.id === qp.coreValueId);
    const supportingValue = db.supportingValues.find(sv => sv.id === qp.supportingValueId);
    const quote = db.quotes.find(q => q.id === qp.quoteId);
    
    if (!coreValue || !supportingValue || !quote) {
      throw new Error(`Invalid quote post ${qp.id}: missing referenced data`);
    }
    
    return {
      ...qp,
      coreValue,
      supportingValue,
      quote,
    };
  });
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

export async function updateQuotePost(id: string, input: UpdateQuotePostInput): Promise<QuotePost | null> {
  const db = await loadDatabase();
  const index = db.quotePosts.findIndex(qp => qp.id === id);
  
  if (index === -1) return null;
  
  const updated = {
    ...db.quotePosts[index],
    ...input,
    updatedAt: new Date(),
  };
  
  db.quotePosts[index] = updated;
  await saveDatabase(db);
  return updated;
}

export async function deleteQuotePost(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const index = db.quotePosts.findIndex(qp => qp.id === id);
  
  if (index === -1) return false;
  
  db.quotePosts.splice(index, 1);
  await saveDatabase(db);
  return true;
}

// Utility functions
export async function getRandomQuotePost(): Promise<QuotePostWithData | null> {
  const quotePosts = await getQuotePosts();
  const unpublished = quotePosts.filter(qp => !qp.isPublished);
  
  if (unpublished.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * unpublished.length);
  return unpublished[randomIndex];
}

export async function seedDatabase(): Promise<void> {
  const db = await loadDatabase();
  
  // Only seed if database is empty
  if (db.coreValues.length > 0 || db.supportingValues.length > 0 || db.quotes.length > 0) {
    return;
  }
  
  const now = new Date();
  
  // Sample core values
  const coreValues: CoreValue[] = [
    { id: nanoid(), value: 'Growth', description: 'Personal development and learning', isActive: true, createdAt: now, updatedAt: now },
    { id: nanoid(), value: 'Balance', description: 'Finding harmony in life', isActive: true, createdAt: now, updatedAt: now },
    { id: nanoid(), value: 'Mindfulness', description: 'Being present and aware', isActive: true, createdAt: now, updatedAt: now },
  ];
  
  // Sample supporting values
  const supportingValues: SupportingValue[] = [
    { id: nanoid(), value: 'Curiosity', description: 'Eagerness to learn and explore', isActive: true, createdAt: now, updatedAt: now },
    { id: nanoid(), value: 'Depth', description: 'Going beyond surface level', isActive: true, createdAt: now, updatedAt: now },
    { id: nanoid(), value: 'Presence', description: 'Being fully engaged in the moment', isActive: true, createdAt: now, updatedAt: now },
  ];
  
  // Sample quotes
  const quotes: Quote[] = [
    { 
      id: nanoid(), 
      text: 'The only way to do great work is to love what you do.', 
      author: 'Steve Jobs',
      category: 'motivation',
      tags: ['work', 'passion'],
      isActive: true, 
      createdAt: now, 
      updatedAt: now 
    },
    { 
      id: nanoid(), 
      text: 'Life is what happens to you while you\'re busy making other plans.', 
      author: 'John Lennon',
      category: 'life',
      tags: ['planning', 'mindfulness'],
      isActive: true, 
      createdAt: now, 
      updatedAt: now 
    },
    { 
      id: nanoid(), 
      text: 'The curious mind never stops learning, never stops growing.', 
      author: 'Albert Einstein',
      category: 'learning',
      tags: ['curiosity', 'growth'],
      isActive: true, 
      createdAt: now, 
      updatedAt: now 
    },
  ];
  
  db.coreValues = coreValues;
  db.supportingValues = supportingValues;
  db.quotes = quotes;
  
  await saveDatabase(db);
}