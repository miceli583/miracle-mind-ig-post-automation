import { NextResponse } from 'next/server';
import { getCoreValues, getSupportingValues, getQuotes, getQuotePosts, getAuthors } from '@/lib/database-relational';

export async function GET() {
  try {
    const [coreValues, supportingValues, quotes, authors, quotePosts] = await Promise.all([
      getCoreValues(),
      getSupportingValues(), 
      getQuotes(),
      getAuthors(),
      getQuotePosts()
    ]);

    const publishedPosts = quotePosts.filter(post => post.isPublished).length;

    return NextResponse.json({
      coreValues: coreValues.length,
      supportingValues: supportingValues.length,
      quotes: quotes.length,
      authors: authors.length,
      posts: quotePosts.length,
      publishedPosts
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}