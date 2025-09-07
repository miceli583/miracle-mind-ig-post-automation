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

    // Perform data quality analysis on Supabase data
    const report = {
      database: 'supabase',
      analysis,
      quality: {
        coreValues: {
          total: coreValues.length,
          withDescription: coreValues.filter(cv => cv.description && cv.description.trim()).length,
          active: coreValues.filter(cv => cv.isActive).length
        },
        supportingValues: {
          total: supportingValues.length,
          withDescription: supportingValues.filter(sv => sv.description && sv.description.trim()).length,
          active: supportingValues.filter(sv => sv.isActive).length
        },
        quotes: {
          total: quotes.length,
          withAuthor: quotes.filter(q => q.author).length,
          withSource: quotes.filter(q => q.source && q.source.trim()).length,
          withTags: quotes.filter(q => q.tags && q.tags.length > 0).length,
          active: quotes.filter(q => q.isActive).length
        },
        authors: {
          total: authors.length,
          active: authors.filter(a => a.isActive).length
        },
        posts: {
          total: quotePosts.length,
          published: quotePosts.filter(p => p.isPublished).length
        }
      },
      recommendations: {
        addDescriptions: coreValues.filter(cv => !cv.description || !cv.description.trim()).map(cv => cv.value),
        addSources: quotes.filter(q => !q.source || !q.source.trim()).map(q => q.text.substring(0, 50) + '...'),
        addTags: quotes.filter(q => !q.tags || q.tags.length === 0).length
      },
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error analyzing Supabase data quality:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze Supabase data quality',
        database: 'supabase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}