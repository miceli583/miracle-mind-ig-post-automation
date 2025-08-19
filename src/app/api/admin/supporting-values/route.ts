import { NextRequest, NextResponse } from 'next/server';
import { getSupportingValues, createSupportingValue } from '@/lib/database-relational';

export async function GET() {
  try {
    const supportingValues = await getSupportingValues();
    return NextResponse.json(supportingValues);
  } catch (error) {
    console.error('Error fetching supporting values:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supporting values' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, description, coreValueId, isActive = true } = body;

    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value is required and must be a string' },
        { status: 400 }
      );
    }

    const supportingValue = await createSupportingValue({
      value: value.trim(),
      description: description?.trim(),
      coreValueId,
      isActive
    });

    return NextResponse.json(supportingValue, { status: 201 });
  } catch (error) {
    console.error('Error creating supporting value:', error);
    return NextResponse.json(
      { error: 'Failed to create supporting value' },
      { status: 500 }
    );
  }
}