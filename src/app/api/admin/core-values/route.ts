import { NextRequest, NextResponse } from 'next/server';
import { getCoreValues, createCoreValue } from '@/lib/supabase-database';

export async function GET() {
  try {
    const coreValues = await getCoreValues();
    return NextResponse.json(coreValues);
  } catch (error) {
    console.error('Error fetching core values:', error);
    return NextResponse.json(
      { error: 'Failed to fetch core values from Supabase database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, description, isActive = true } = body;

    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value is required and must be a string' },
        { status: 400 }
      );
    }

    const coreValue = await createCoreValue({
      value: value.trim(),
      description: description?.trim(),
      isActive
    });

    return NextResponse.json(coreValue, { status: 201 });
  } catch (error) {
    console.error('Error creating core value:', error);
    return NextResponse.json(
      { error: 'Failed to create core value in Supabase database' },
      { status: 500 }
    );
  }
}