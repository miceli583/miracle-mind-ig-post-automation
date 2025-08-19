import { NextRequest, NextResponse } from 'next/server';
import { deleteCoreValue } from '@/lib/database-relational';

// TODO: Implement updateCoreValue function in database-relational.ts if needed

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteCoreValue(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Core value not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting core value:', error);
    return NextResponse.json(
      { error: 'Failed to delete core value' },
      { status: 500 }
    );
  }
}