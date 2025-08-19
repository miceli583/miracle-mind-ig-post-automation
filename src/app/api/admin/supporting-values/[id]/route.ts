import { NextRequest, NextResponse } from 'next/server';
import { deleteSupportingValue } from '@/lib/database-relational';

// TODO: Implement updateSupportingValue function in database-relational.ts if needed

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteSupportingValue(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Supporting value not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting supporting value:', error);
    return NextResponse.json(
      { error: 'Failed to delete supporting value' },
      { status: 500 }
    );
  }
}