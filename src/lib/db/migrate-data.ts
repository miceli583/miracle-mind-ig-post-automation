import { eq } from 'drizzle-orm';
import { db } from './connection';
import * as schema from './schema';
import { loadDatabase } from '../database-relational';

/**
 * Migration script to move data from JSON files to PostgreSQL database
 * This script safely migrates all existing data while preserving relationships
 */

export interface MigrationResult {
  success: boolean;
  message: string;
  counts: {
    coreValues: number;
    supportingValues: number;
    authors: number;
    quotes: number;
    coreValueSupportingValues: number;
    coreValueQuotes: number;
    quotePosts: number;
  };
}

/**
 * Main migration function
 */
export async function migrateFromJson(): Promise<MigrationResult> {
  try {
    console.log('🚀 Starting data migration from JSON to PostgreSQL...');
    
    // Load existing JSON data
    console.log('📂 Loading JSON data...');
    const jsonData = await loadDatabase();
    
    // Check if database already has data
    const existingCoreValues = await db.select().from(schema.coreValues).limit(1);
    if (existingCoreValues.length > 0) {
      return {
        success: false,
        message: 'Database already contains data. Use --force flag to overwrite.',
        counts: {
          coreValues: 0,
          supportingValues: 0,
          authors: 0,
          quotes: 0,
          coreValueSupportingValues: 0,
          coreValueQuotes: 0,
          quotePosts: 0,
        },
      };
    }
    
    // Start transaction for data integrity
    const result = await db.transaction(async (tx) => {
      console.log('🔄 Migrating core values...');
      const coreValueInserts = jsonData.coreValues.map(cv => ({
        id: cv.id,
        value: cv.value,
        description: cv.description || null,
        isActive: cv.isActive,
        createdAt: cv.createdAt,
        updatedAt: cv.updatedAt,
      }));
      
      if (coreValueInserts.length > 0) {
        await tx.insert(schema.coreValues).values(coreValueInserts);
      }
      
      console.log('🔄 Migrating supporting values...');
      const supportingValueInserts = jsonData.supportingValues.map(sv => ({
        id: sv.id,
        value: sv.value,
        description: sv.description || null,
        isActive: sv.isActive,
        createdAt: sv.createdAt,
        updatedAt: sv.updatedAt,
      }));
      
      if (supportingValueInserts.length > 0) {
        await tx.insert(schema.supportingValues).values(supportingValueInserts);
      }
      
      console.log('🔄 Migrating authors...');
      const authorInserts = jsonData.authors.map(author => ({
        id: author.id,
        name: author.name,
        isActive: author.isActive,
        createdAt: author.createdAt,
        updatedAt: author.updatedAt,
      }));
      
      if (authorInserts.length > 0) {
        await tx.insert(schema.authors).values(authorInserts);
      }
      
      console.log('🔄 Migrating quotes...');
      const quoteInserts = jsonData.quotes.map(quote => ({
        id: quote.id,
        text: quote.text,
        authorId: quote.authorId || null,
        source: quote.source || null,
        category: quote.category || null,
        tags: quote.tags || null,
        isActive: quote.isActive,
        createdAt: quote.createdAt,
        updatedAt: quote.updatedAt,
      }));
      
      if (quoteInserts.length > 0) {
        await tx.insert(schema.quotes).values(quoteInserts);
      }
      
      console.log('🔄 Migrating core value ↔ supporting value relationships...');
      const cvSvInserts = jsonData.coreValueSupportingValues.map(rel => ({
        id: rel.id,
        coreValueId: rel.coreValueId,
        supportingValueId: rel.supportingValueId,
        createdAt: rel.createdAt,
      }));
      
      if (cvSvInserts.length > 0) {
        await tx.insert(schema.coreValueSupportingValues).values(cvSvInserts);
      }
      
      console.log('🔄 Migrating core value ↔ quote relationships...');
      const cvQuoteInserts = jsonData.coreValueQuotes.map(rel => ({
        id: rel.id,
        coreValueId: rel.coreValueId,
        quoteId: rel.quoteId,
        createdAt: rel.createdAt,
      }));
      
      if (cvQuoteInserts.length > 0) {
        await tx.insert(schema.coreValueQuotes).values(cvQuoteInserts);
      }
      
      console.log('🔄 Migrating quote posts...');
      const quotePostInserts = jsonData.quotePosts.map(qp => ({
        id: qp.id,
        coreValueId: qp.coreValueId,
        supportingValueId: qp.supportingValueId,
        quoteId: qp.quoteId,
        isPublished: qp.isPublished,
        publishedAt: qp.publishedAt || null,
        scheduledFor: qp.scheduledFor || null,
        metaPostId: qp.metaPostId || null,
        imageUrl: qp.imageUrl || null,
        createdAt: qp.createdAt,
        updatedAt: qp.updatedAt,
      }));
      
      if (quotePostInserts.length > 0) {
        await tx.insert(schema.quotePosts).values(quotePostInserts);
      }
      
      return {
        coreValues: coreValueInserts.length,
        supportingValues: supportingValueInserts.length,
        authors: authorInserts.length,
        quotes: quoteInserts.length,
        coreValueSupportingValues: cvSvInserts.length,
        coreValueQuotes: cvQuoteInserts.length,
        quotePosts: quotePostInserts.length,
      };
    });
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Migration summary:', result);
    
    return {
      success: true,
      message: 'Data migration completed successfully',
      counts: result,
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      counts: {
        coreValues: 0,
        supportingValues: 0,
        authors: 0,
        quotes: 0,
        coreValueSupportingValues: 0,
        coreValueQuotes: 0,
        quotePosts: 0,
      },
    };
  }
}

/**
 * Clear all data from the database (useful for re-running migrations)
 */
export async function clearDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🧹 Clearing database...');
    
    await db.transaction(async (tx) => {
      // Delete in reverse order of dependencies
      await tx.delete(schema.quotePosts);
      await tx.delete(schema.coreValueQuotes);
      await tx.delete(schema.coreValueSupportingValues);
      await tx.delete(schema.quotes);
      await tx.delete(schema.authors);
      await tx.delete(schema.supportingValues);
      await tx.delete(schema.coreValues);
    });
    
    console.log('✅ Database cleared successfully!');
    return {
      success: true,
      message: 'Database cleared successfully',
    };
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    return {
      success: false,
      message: `Failed to clear database: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Verify data integrity after migration
 */
export async function verifyMigration(): Promise<{ success: boolean; message: string; issues: string[] }> {
  try {
    console.log('🔍 Verifying migration...');
    const issues: string[] = [];
    
    // Check that all relationships are valid
    const coreValueRels = await db.select().from(schema.coreValueSupportingValues);
    for (const rel of coreValueRels) {
      const coreValue = await db.select().from(schema.coreValues).where(eq(schema.coreValues.id, rel.coreValueId)).limit(1);
      const supportingValue = await db.select().from(schema.supportingValues).where(eq(schema.supportingValues.id, rel.supportingValueId)).limit(1);
      
      if (coreValue.length === 0) {
        issues.push(`Core value ${rel.coreValueId} referenced in relationship but not found`);
      }
      if (supportingValue.length === 0) {
        issues.push(`Supporting value ${rel.supportingValueId} referenced in relationship but not found`);
      }
    }
    
    // Check quote-author relationships
    const quotes = await db.select().from(schema.quotes);
    for (const quote of quotes) {
      if (quote.authorId) {
        const author = await db.select().from(schema.authors).where(eq(schema.authors.id, quote.authorId)).limit(1);
        if (author.length === 0) {
          issues.push(`Quote ${quote.id} references author ${quote.authorId} but author not found`);
        }
      }
    }
    
    console.log('✅ Migration verification completed!');
    
    return {
      success: issues.length === 0,
      message: issues.length === 0 ? 'All data integrity checks passed' : `Found ${issues.length} issues`,
      issues,
    };
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return {
      success: false,
      message: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      issues: [],
    };
  }
}

/**
 * Get migration status
 */
export async function getMigrationStatus() {
  try {
    const counts = {
      coreValues: (await db.select().from(schema.coreValues)).length,
      supportingValues: (await db.select().from(schema.supportingValues)).length,
      authors: (await db.select().from(schema.authors)).length,
      quotes: (await db.select().from(schema.quotes)).length,
      coreValueSupportingValues: (await db.select().from(schema.coreValueSupportingValues)).length,
      coreValueQuotes: (await db.select().from(schema.coreValueQuotes)).length,
      quotePosts: (await db.select().from(schema.quotePosts)).length,
    };
    
    return {
      success: true,
      isEmpty: Object.values(counts).every(count => count === 0),
      counts,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      isEmpty: true,
      counts: {
        coreValues: 0,
        supportingValues: 0,
        authors: 0,
        quotes: 0,
        coreValueSupportingValues: 0,
        coreValueQuotes: 0,
        quotePosts: 0,
      },
    };
  }
}