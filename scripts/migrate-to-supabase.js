#!/usr/bin/env node

/**
 * Data Migration Script: JSON to Supabase
 * Migrates all data from data/database-relational.json to Supabase tables
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false }
  }
);

// Load JSON data
const dataPath = path.join(__dirname, '../data/database-relational.json');
const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🚀 Starting data migration to Supabase...');
console.log(`📊 Data loaded from: ${dataPath}`);

async function migrateData() {
  try {
    // Step 1: Migrate Core Values
    console.log('\n📝 Migrating Core Values...');
    const { data: coreValuesResult, error: coreValuesError } = await supabase
      .from('core_values')
      .insert(jsonData.coreValues.map(cv => ({
        id: cv.id,
        value: cv.value,
        description: cv.description,
        is_active: cv.isActive,
        created_at: cv.createdAt,
        updated_at: cv.updatedAt
      })));

    if (coreValuesError) throw coreValuesError;
    console.log(`✅ Migrated ${jsonData.coreValues.length} core values`);

    // Step 2: Migrate Supporting Values
    console.log('\n📝 Migrating Supporting Values...');
    const { data: supportingValuesResult, error: supportingValuesError } = await supabase
      .from('supporting_values')
      .insert(jsonData.supportingValues.map(sv => ({
        id: sv.id,
        value: sv.value,
        description: sv.description,
        is_active: sv.isActive,
        created_at: sv.createdAt,
        updated_at: sv.updatedAt
      })));

    if (supportingValuesError) throw supportingValuesError;
    console.log(`✅ Migrated ${jsonData.supportingValues.length} supporting values`);

    // Step 3: Migrate Authors
    console.log('\n📝 Migrating Authors...');
    const { data: authorsResult, error: authorsError } = await supabase
      .from('authors')
      .insert(jsonData.authors.map(author => ({
        id: author.id,
        name: author.name,
        is_active: author.isActive,
        created_at: author.createdAt,
        updated_at: author.updatedAt
      })));

    if (authorsError) throw authorsError;
    console.log(`✅ Migrated ${jsonData.authors.length} authors`);

    // Step 4: Migrate Quotes
    console.log('\n📝 Migrating Quotes...');
    const { data: quotesResult, error: quotesError } = await supabase
      .from('quotes')
      .insert(jsonData.quotes.map(quote => ({
        id: quote.id,
        text: quote.text,
        author_id: quote.authorId,
        source: quote.source,
        category: quote.category,
        tags: quote.tags,
        is_active: quote.isActive,
        created_at: quote.createdAt,
        updated_at: quote.updatedAt
      })));

    if (quotesError) throw quotesError;
    console.log(`✅ Migrated ${jsonData.quotes.length} quotes`);

    // Step 5: Migrate Core Value <-> Supporting Value Relationships
    console.log('\n📝 Migrating Core Value <-> Supporting Value Relationships...');
    const { data: cvSvResult, error: cvSvError } = await supabase
      .from('core_value_supporting_values')
      .insert(jsonData.coreValueSupportingValues.map(rel => ({
        id: rel.id,
        core_value_id: rel.coreValueId,
        supporting_value_id: rel.supportingValueId,
        created_at: rel.createdAt
      })));

    if (cvSvError) throw cvSvError;
    console.log(`✅ Migrated ${jsonData.coreValueSupportingValues.length} core-supporting value relationships`);

    // Step 6: Migrate Core Value <-> Quote Relationships
    console.log('\n📝 Migrating Core Value <-> Quote Relationships...');
    const { data: cvQuoteResult, error: cvQuoteError } = await supabase
      .from('core_value_quotes')
      .insert(jsonData.coreValueQuotes.map(rel => ({
        id: rel.id,
        core_value_id: rel.coreValueId,
        quote_id: rel.quoteId,
        created_at: rel.createdAt
      })));

    if (cvQuoteError) throw cvQuoteError;
    console.log(`✅ Migrated ${jsonData.coreValueQuotes.length} core value-quote relationships`);

    // Step 7: Migrate Quote Posts (if any exist)
    if (jsonData.quotePosts && jsonData.quotePosts.length > 0) {
      console.log('\n📝 Migrating Quote Posts...');
      const { data: quotePostsResult, error: quotePostsError } = await supabase
        .from('quote_posts')
        .insert(jsonData.quotePosts.map(post => ({
          id: post.id,
          core_value_id: post.coreValueId,
          supporting_value_id: post.supportingValueId,
          quote_id: post.quoteId,
          is_published: post.isPublished,
          published_at: post.publishedAt,
          scheduled_for: post.scheduledFor,
          meta_post_id: post.metaPostId,
          image_url: post.imageUrl,
          created_at: post.createdAt,
          updated_at: post.updatedAt
        })));

      if (quotePostsError) throw quotePostsError;
      console.log(`✅ Migrated ${jsonData.quotePosts.length} quote posts`);
    } else {
      console.log('\n📝 No quote posts to migrate');
    }

    console.log('\n🎉 Migration completed successfully!');
    
    // Verify migration
    await verifyMigration();

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  const tables = [
    'core_values',
    'supporting_values', 
    'authors',
    'quotes',
    'core_value_supporting_values',
    'core_value_quotes',
    'quote_posts'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id', { count: 'exact' });
    if (error) {
      console.error(`❌ Error checking ${table}:`, error.message);
    } else {
      console.log(`✅ ${table}: ${data.length} records`);
    }
  }
}

// Run migration
migrateData();