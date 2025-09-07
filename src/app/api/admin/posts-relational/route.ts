import { NextResponse } from 'next/server';
import { getQuotePosts } from '@/lib/supabase-database';

export async function GET() {
  try {
    const posts = await getQuotePosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts from Supabase:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts from database' },
      { status: 500 }
    );
  }
}