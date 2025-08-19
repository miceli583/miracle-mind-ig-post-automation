import { NextResponse } from 'next/server';
import { getCoreValues, getSupportingValues, getQuotes, getAuthors } from '@/lib/database-relational';

export async function GET() {
  try {
    const [coreValues, supportingValues, quotes, authors] = await Promise.all([
      getCoreValues(),
      getSupportingValues(),
      getQuotes(),
      getAuthors()
    ]);

    return NextResponse.json({
      status: 'success',
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}