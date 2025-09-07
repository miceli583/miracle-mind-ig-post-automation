import { NextResponse } from 'next/server';
import { getCoreValues, getSupportingValues, getQuotes, getAuthors, getQuotePosts, analyzeDatabase } from '@/lib/supabase-database';

export async function GET() {
  try {
    const [coreValues, supportingValues, quotes, authors, quotePosts, analysis] = await Promise.all([
      getCoreValues(),
      getSupportingValues(),
      getQuotes(), 
      getAuthors(),
      getQuotePosts(),
      analyzeDatabase()
    ]);
    
    return NextResponse.json({
      database: 'supabase',
      analysis,
      structure: {
        coreValues,
        supportingValues,
        quotes,
        authors,
        quotePosts: quotePosts.slice(0, 10) // Limit to first 10 for performance
      },
      metadata: {
        totalRecords: analysis.coreValues + analysis.supportingValues + analysis.quotes + analysis.authors + analysis.posts,
        lastUpdated: new Date().toISOString(),
        source: 'Supabase PostgreSQL Database'
      }
    });
  } catch (error) {
    console.error('Error reading Supabase database structure:', error);
    return NextResponse.json(
      { error: 'Failed to read Supabase database structure', database: 'supabase' },
      { status: 500 }
    );
  }
}