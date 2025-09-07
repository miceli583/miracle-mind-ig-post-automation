#!/usr/bin/env tsx

/**
 * Database Migration CLI Script
 * 
 * Usage:
 *   npx tsx scripts/migrate-to-db.ts                    # Run migration
 *   npx tsx scripts/migrate-to-db.ts --clear            # Clear database first
 *   npx tsx scripts/migrate-to-db.ts --verify           # Verify migration
 *   npx tsx scripts/migrate-to-db.ts --status           # Check status
 */

import { migrateFromJson, clearDatabase, verifyMigration, getMigrationStatus } from '../src/lib/db/migrate-data';

async function main() {
  const args = process.argv.slice(2);
  const hasFlag = (flag: string) => args.includes(flag);

  try {
    // Check status
    if (hasFlag('--status')) {
      console.log('📊 Checking migration status...\n');
      const status = await getMigrationStatus();
      
      if (!status.success) {
        console.error('❌ Failed to check status:', status.error);
        process.exit(1);
      }
      
      console.log('Database Status:', status.isEmpty ? 'Empty' : 'Contains Data');
      console.log('Record Counts:');
      Object.entries(status.counts).forEach(([table, count]) => {
        console.log(`  ${table}: ${count}`);
      });
      
      return;
    }

    // Clear database
    if (hasFlag('--clear')) {
      console.log('🧹 Clearing database...\n');
      const clearResult = await clearDatabase();
      
      if (!clearResult.success) {
        console.error('❌ Clear failed:', clearResult.message);
        process.exit(1);
      }
      
      console.log('✅', clearResult.message);
      
      if (!hasFlag('--migrate')) {
        return;
      }
    }

    // Verify migration
    if (hasFlag('--verify')) {
      console.log('🔍 Verifying migration...\n');
      const verifyResult = await verifyMigration();
      
      if (!verifyResult.success) {
        console.error('❌ Verification failed:', verifyResult.message);
        if (verifyResult.issues.length > 0) {
          console.error('Issues found:');
          verifyResult.issues.forEach(issue => console.error(`  - ${issue}`));
        }
        process.exit(1);
      }
      
      console.log('✅', verifyResult.message);
      return;
    }

    // Run migration (default)
    console.log('🚀 Starting database migration...\n');
    const result = await migrateFromJson();
    
    if (!result.success) {
      console.error('❌ Migration failed:', result.message);
      process.exit(1);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    Object.entries(result.counts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} records`);
    });
    
    // Auto-verify after successful migration
    console.log('\n🔍 Running verification...');
    const verifyResult = await verifyMigration();
    
    if (!verifyResult.success) {
      console.warn('⚠️  Verification found issues:', verifyResult.message);
      if (verifyResult.issues.length > 0) {
        console.warn('Issues found:');
        verifyResult.issues.forEach(issue => console.warn(`  - ${issue}`));
      }
    } else {
      console.log('✅', verifyResult.message);
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Handle unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});