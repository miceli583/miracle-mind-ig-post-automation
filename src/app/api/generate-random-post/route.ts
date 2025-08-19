import { NextResponse } from 'next/server';
import { getCoreValues, getSupportingValues, getQuotes, createQuotePost } from '@/lib/database';

export async function POST() {
  try {
    const [coreValues, supportingValues, quotes] = await Promise.all([
      getCoreValues(),
      getSupportingValues(),
      getQuotes()
    ]);

    if (coreValues.length === 0 || supportingValues.length === 0 || quotes.length === 0) {
      return NextResponse.json(
        { error: 'Not enough data available. Please add core values, supporting values, and quotes first.' },
        { status: 400 }
      );
    }

    // Select random items
    const randomCore = coreValues[Math.floor(Math.random() * coreValues.length)];
    const randomSupporting = supportingValues[Math.floor(Math.random() * supportingValues.length)];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // Create a new quote post
    const quotePost = await createQuotePost({
      coreValueId: randomCore.id,
      supportingValueId: randomSupporting.id,
      quoteId: randomQuote.id,
      isPublished: false
    });

    return NextResponse.json({
      quotePost,
      preview: {
        coreValue: randomCore.value,
        supportingValue: randomSupporting.value,
        quote: randomQuote.text,
        author: randomQuote.author
      }
    });
  } catch (error) {
    console.error('Error generating random post:', error);
    return NextResponse.json(
      { error: 'Failed to generate random post' },
      { status: 500 }
    );
  }
}