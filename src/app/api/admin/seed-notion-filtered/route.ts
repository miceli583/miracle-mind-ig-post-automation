import { NextResponse } from 'next/server';
import { parseNotionCSV } from '@/lib/data-parser';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    const csvPath = path.join(process.cwd(), 'Core Values 24b036b75a3e80b28544f94f797a6711_all.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const cleanedData = parseNotionCSV(csvContent);
    
    // Save the cleaned data to the relational database
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    const dbFile = path.join(dataDir, 'database-relational.json');
    await fs.writeFile(dbFile, JSON.stringify(cleanedData, null, 2));
    
    // Generate a summary report
    const summary = {
      coreValues: cleanedData.coreValues.length,
      supportingValues: cleanedData.supportingValues.length,
      authors: cleanedData.authors.length,
      quotes: cleanedData.quotes.length,
      relationships: {
        coreValueSupportingValues: cleanedData.coreValueSupportingValues.length,
        coreValueQuotes: cleanedData.coreValueQuotes.length
      }
    };
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully imported and cleaned Notion data: ${summary.coreValues} core values, ${summary.supportingValues} supporting values, ${summary.quotes} quality-filtered quotes from ${summary.authors} authors with proper thematic relationships.`,
      summary
    });
  } catch (error) {
    console.error('Error importing filtered Notion data:', error);
    return NextResponse.json(
      { error: 'Failed to import filtered Notion data. Make sure the CSV file exists in the project root.' },
      { status: 500 }
    );
  }
}