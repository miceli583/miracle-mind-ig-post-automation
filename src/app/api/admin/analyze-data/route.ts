import { NextResponse } from 'next/server';
import { analyzeDataQuality } from '@/lib/data-quality-analyzer';

export async function GET() {
  try {
    const report = await analyzeDataQuality();
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error analyzing data quality:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data quality' },
      { status: 500 }
    );
  }
}