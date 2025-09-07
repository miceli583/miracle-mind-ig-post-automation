import { NextResponse } from 'next/server';
import { seedFromNotionCSV, analyzeDatabase } from '@/lib/supabase-database';

export async function POST() {
  try {
    await seedFromNotionCSV();
    const analysis = await analyzeDatabase();
    return NextResponse.json({ 
      success: true, 
      database: 'supabase',
      message: 'Successfully imported data from Notion CSV with proper thematic relationships to Supabase',
      analysis
    });
  } catch (error) {
    console.error('Error seeding Supabase from Notion CSV:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import Notion data to Supabase database. CSV seeding should be done via migration scripts.',
        database: 'supabase',
        details: error instanceof Error ? error.message : 'CSV import not implemented for Supabase'
      },
      { status: 500 }
    );
  }
}