import { NextRequest, NextResponse } from 'next/server';
import { getSupportingValues, createSupportingValue, getCoreValues } from '@/lib/supabase-database';
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
    const [supportingValues, coreValues] = await Promise.all([
      getSupportingValues(),
      getCoreValues()
    ]);

    // Fetch relationship data from junction table
    const { data: relationships, error } = await supabase
      .from('core_value_supporting_values')
      .select('core_value_id, supporting_value_id');

    if (error) {
      console.error('Error fetching relationships:', error);
      return NextResponse.json(supportingValues); // Fallback to basic data
    }

    // Enhance supporting values with relationship information
    const enhancedSupportingValues = supportingValues.map(sv => {
      const relatedCoreValueIds = relationships
        ?.filter(rel => rel.supporting_value_id === sv.id)
        .map(rel => rel.core_value_id) || [];
      
      const relatedCoreValueNames = relatedCoreValueIds
        .map(id => coreValues.find(cv => cv.id === id)?.value)
        .filter(Boolean);

      return {
        ...sv,
        coreValueIds: relatedCoreValueIds,
        coreValueNames: relatedCoreValueNames
      };
    });

    return NextResponse.json(enhancedSupportingValues);
  } catch (error) {
    console.error('Error fetching supporting values:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supporting values from Supabase database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, description, coreValueId, coreValueIds, isActive = true } = body;

    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate that at least one core value is provided
    if (!coreValueId && (!coreValueIds || !Array.isArray(coreValueIds) || coreValueIds.length === 0)) {
      return NextResponse.json(
        { error: 'At least one core value must be specified' },
        { status: 400 }
      );
    }

    const supportingValue = await createSupportingValue({
      value: value.trim(),
      description: description?.trim(),
      coreValueId,
      coreValueIds,
      isActive
    });

    return NextResponse.json(supportingValue, { status: 201 });
  } catch (error) {
    console.error('Error creating supporting value:', error);
    return NextResponse.json(
      { error: 'Failed to create supporting value in Supabase database' },
      { status: 500 }
    );
  }
}