import { NextResponse } from 'next/server';
import { getCoreValues, getSupportingValues, getQuotes, getAuthors, analyzeDatabase } from '@/lib/supabase-database';

export async function GET() {
  try {
    const [coreValues, supportingValues, quotes, authors, analysis] = await Promise.all([
      getCoreValues(),
      getSupportingValues(),
      getQuotes(),
      getAuthors(),
      analyzeDatabase()
    ]);

    return NextResponse.json({
      status: 'success',
      database: 'supabase',
      analysis,
      counts: {
        coreValues: coreValues.length,
        supportingValues: supportingValues.length,
        quotes: quotes.length,
        authors: authors.length
      },
      samples: {
        coreValues: coreValues.slice(0, 2),
        supportingValues: supportingValues.slice(0, 3),
        quotes: quotes.slice(0, 2),
        authors: authors.slice(0, 2)
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      database: 'supabase',
      error: error instanceof Error ? error.message : 'Unknown error occurred with Supabase database'
    });
  }
}