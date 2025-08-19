import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'database-relational.json');

export async function GET() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error reading database structure:', error);
    return NextResponse.json(
      { error: 'Failed to read database structure' },
      { status: 500 }
    );
  }
}