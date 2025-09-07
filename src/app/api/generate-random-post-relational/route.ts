import { NextResponse } from 'next/server';
import { getRandomQuotePostData, createQuotePost, getCoreValues, getSupportingValues, getQuotes } from '@/lib/supabase-database';

export async function POST() {
  try {
    const randomData = await getRandomQuotePostData();
    
    if (!randomData) {
      // Add better error logging to understand what's missing
      const coreValues = await getCoreValues();
      const supportingValues = await getSupportingValues();
      const quotes = await getQuotes();
      
      console.error('Random post generation failed:', {
        coreValuesCount: coreValues.length,
        supportingValuesCount: supportingValues.length,
        quotesCount: quotes.length
      });
      
      return NextResponse.json(
        { error: 'Not enough thematically related data available in Supabase database.' },
        { status: 400 }
      );
    }

    // Create a new quote post with the thematically matched data
    const quotePost = await createQuotePost({
      coreValueId: randomData.coreValue.id,
      supportingValueId: randomData.supportingValue.id,
      quoteId: randomData.quote.id,
      isPublished: false
    });

    return NextResponse.json({
      quotePost,
      preview: {
        coreValue: randomData.coreValue.value,
        supportingValue: randomData.supportingValue.value,
        quote: randomData.quote.text,
        author: randomData.quote.author?.name || ''
      },
      relationships: {
        coreValueId: randomData.coreValue.id,
        supportingValueId: randomData.supportingValue.id,
        quoteId: randomData.quote.id,
        authorId: randomData.quote.author?.id
      }
    });
  } catch (error) {
    console.error('Error generating random relational post:', error);
    return NextResponse.json(
      { error: 'Failed to generate thematically matched post' },
      { status: 500 }
    );
  }
}