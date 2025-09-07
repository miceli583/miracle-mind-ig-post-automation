import { NextRequest, NextResponse } from 'next/server';
import { getQuotes, createQuote, getCoreValues } from '@/lib/supabase-database';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false }
  }
);

export async function GET() {
  try {
    const [quotes, coreValues] = await Promise.all([
      getQuotes(),
      getCoreValues()
    ]);

    // Fetch relationship data from junction table
    const { data: relationships, error } = await supabase
      .from('core_value_quotes')
      .select('core_value_id, quote_id');

    if (error) {
      console.error('Error fetching quote relationships:', error);
      return NextResponse.json(quotes); // Fallback to basic data
    }

    // Enhance quotes with relationship information
    const enhancedQuotes = quotes.map(quote => {
      const relatedCoreValueIds = relationships
        ?.filter(rel => rel.quote_id === quote.id)
        .map(rel => rel.core_value_id) || [];
      
      const relatedCoreValueNames = relatedCoreValueIds
        .map(id => coreValues.find(cv => cv.id === id)?.value)
        .filter(Boolean);

      return {
        ...quote,
        coreValueIds: relatedCoreValueIds,
        coreValueNames: relatedCoreValueNames
      };
    });

    return NextResponse.json(enhancedQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes from Supabase database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, authorId, category, tags, coreValueId, coreValueIds, isActive = true } = body;

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
      coreValueIds,
      isActive
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote in Supabase database' },
      { status: 500 }
    );
  }
}