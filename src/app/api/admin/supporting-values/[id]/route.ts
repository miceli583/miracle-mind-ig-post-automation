import { NextRequest, NextResponse } from 'next/server';
import { updateSupportingValue, archiveSupportingValue, deleteSupportingValue } from '@/lib/supabase-database';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { value, description, coreValueIds, isActive } = body;

    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value is required and must be a string' },
        { status: 400 }
      );
    }

    const updatedValue = await updateSupportingValue(id, {
      value: value.trim(),
      description: description?.trim(),
      coreValueIds,
      isActive
    });

    if (!updatedValue) {
      return NextResponse.json(
        { error: 'Supporting value not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedValue);
  } catch (error) {
    console.error('Error updating supporting value:', error);
    return NextResponse.json(
      { error: 'Failed to update supporting value in Supabase database' },
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
      const success = await archiveSupportingValue(id);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Supporting value not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, message: 'Supporting value archived' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error archiving supporting value:', error);
    return NextResponse.json(
      { error: 'Failed to archive supporting value in Supabase database' },
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
    const deleted = await deleteSupportingValue(id);

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
      { error: 'Failed to delete supporting value from Supabase database' },
      { status: 500 }
    );
  }
}