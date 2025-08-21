import { NextRequest, NextResponse } from 'next/server';
import { updateQuote, archiveQuote, deleteQuote } from '@/lib/database-relational';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, authorId, coreValueIds, isActive } = body;

    const updatedQuote = await updateQuote(id, {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (body.action === 'archive') {
      const success = await archiveQuote(id);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Quote not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, message: 'Quote archived' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error archiving quote:', error);
    return NextResponse.json(
      { error: 'Failed to archive quote' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteQuote(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    );
  }
}