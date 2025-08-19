import { NextRequest, NextResponse } from 'next/server';
import { getQuotes, createQuote } from '@/lib/database-relational';

export async function GET() {
  try {
    const quotes = await getQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, authorId, category, tags, coreValueId, isActive = true } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Quote text is required and must be a string' },
        { status: 400 }
      );
    }

    const quote = await createQuote({
      text: text.trim(),
      authorId,
      category,
      tags,
      coreValueId,
      isActive
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}