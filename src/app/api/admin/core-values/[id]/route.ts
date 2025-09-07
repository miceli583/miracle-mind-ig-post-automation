import { NextRequest, NextResponse } from 'next/server';
import { updateCoreValue, archiveCoreValue, deleteCoreValue } from '@/lib/supabase-database';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { value, description, isActive } = body;

    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value is required and must be a string' },
        { status: 400 }
      );
    }

    const updatedValue = await updateCoreValue(id, {
      value: value.trim(),
      description: description?.trim(),
      isActive
    });

    if (!updatedValue) {
      return NextResponse.json(
        { error: 'Core value not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedValue);
  } catch (error) {
    console.error('Error updating core value:', error);
    return NextResponse.json(
      { error: 'Failed to update core value in Supabase database' },
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
      const success = await archiveCoreValue(id);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Core value not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, message: 'Core value archived' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error archiving core value:', error);
    return NextResponse.json(
      { error: 'Failed to archive core value in Supabase database' },
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
    const deleted = await deleteCoreValue(id);

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
      { error: 'Failed to delete core value from Supabase database' },
      { status: 500 }
    );
  }
}