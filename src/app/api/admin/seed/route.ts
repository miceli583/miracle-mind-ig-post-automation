import { NextResponse } from 'next/server';
import { seedDatabase, analyzeDatabase } from '@/lib/supabase-database';

export async function POST() {
  try {
    await seedDatabase();
    const analysis = await analyzeDatabase();
    return NextResponse.json({ 
      success: true, 
      database: 'supabase',
      message: 'Database seeding completed using Supabase',
      analysis
    });
  } catch (error) {
    console.error('Error seeding Supabase database:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed Supabase database',
        database: 'supabase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}