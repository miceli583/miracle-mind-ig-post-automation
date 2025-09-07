import { NextRequest, NextResponse } from 'next/server';
import { getAuthors, createAuthor } from '@/lib/supabase-database';

export async function GET() {
  try {
    const authors = await getAuthors();
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors from Supabase database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, isActive = true } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Author name is required and must be a string' },
        { status: 400 }
      );
    }

    const author = await createAuthor({
      name: name.trim(),
      isActive
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author in Supabase database' },
      { status: 500 }
    );
  }
}