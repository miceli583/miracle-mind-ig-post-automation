import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/database';

export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}