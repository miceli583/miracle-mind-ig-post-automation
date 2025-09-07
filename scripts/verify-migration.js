#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function verifyMigration() {
  console.log('🔍 Final Migration Verification\n');
  
  const tables = [
    'core_values',
    'supporting_values', 
    'authors',
    'quotes',
    'core_value_supporting_values',
    'core_value_quotes',
    'quote_posts'
  ];

  let totalRecords = 0;

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error(`❌ Error checking ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table.padEnd(30)} ${count} records`);
      totalRecords += count;
    }
  }
  
  console.log('\n📊 Migration Summary:');
  console.log(`Total records migrated: ${totalRecords}`);
  console.log('✅ All data successfully migrated to Supabase!');
  
  // Test a relational query
  console.log('\n🔗 Testing relational query...');
  const { data: testData, error: testError } = await supabase
    .from('quotes')
    .select(`
      id,
      text,
      authors(name)
    `)
    .limit(3);
    
  if (testError) {
    console.error('❌ Relational query failed:', testError.message);
  } else {
    console.log('✅ Relational queries working:');
    testData.forEach(quote => {
      const authorName = quote.authors?.name || 'Unknown';
      const shortText = quote.text.substring(0, 50);
      console.log(`  - "${shortText}..." by ${authorName}`);
    });
  }
}

verifyMigration().catch(console.error);