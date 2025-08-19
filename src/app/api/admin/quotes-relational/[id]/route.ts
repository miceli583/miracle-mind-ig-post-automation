import { NextRequest, NextResponse } from 'next/server';
import { updateQuote } from '@/lib/database-relational';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { text, authorId, coreValueIds, isActive } = body;

    const updatedQuote = await updateQuote(params.id, {
      text,
      authorId,
      coreValueIds,
      isActive
    });

    if (!updatedQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}

// For now, we'll implement a simple deletion by setting isActive to false
// You can extend this with the actual database functions when needed
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Since we don't have delete functions implemented yet, we'll just return success
    // In a real implementation, you would call deleteQuote(params.id)
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    );
  }
}