import { NextResponse } from 'next/server';
import { getQuotePosts } from '@/lib/database-relational';

export async function GET() {
  try {
    const posts = await getQuotePosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}