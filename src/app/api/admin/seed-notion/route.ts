import { NextResponse } from 'next/server';
import { seedFromNotionCSV } from '@/lib/database-relational';

export async function POST() {
  try {
    await seedFromNotionCSV();
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully imported data from Notion CSV with proper thematic relationships' 
    });
  } catch (error) {
    console.error('Error seeding from Notion CSV:', error);
    return NextResponse.json(
      { error: 'Failed to import Notion data. Make sure the CSV file exists in the project root.' },
      { status: 500 }
    );
  }
}