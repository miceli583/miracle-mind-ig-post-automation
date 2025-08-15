import { NextRequest, NextResponse } from 'next/server';
import { validateQuoteData, getFieldErrors } from '@/lib/validation';
import { sanitizeQuoteData } from '@/lib/sanitization';
import { generateQuoteTemplate } from '@/lib/template';
import { browserPool } from '@/lib/browser-pool';
import { DESIGN_CONFIG } from '@/config/design';

export async function POST(request: NextRequest) {
  let page = null;
  
  try {
    // Parse and validate request body
    const requestBody = await request.json().catch(() => null);
    
    if (!requestBody) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    // Validate input data
    const validation = validateQuoteData(requestBody);
    
    if (!validation.success) {
      const fieldErrors = getFieldErrors(validation.error);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          code: 'VALIDATION_ERROR',
          fields: fieldErrors 
        },
        { status: 400 }
      );
    }

    // Sanitize the validated data
    const sanitizedData = sanitizeQuoteData(validation.data);
    
    // Generate HTML template
    const html = generateQuoteTemplate(sanitizedData);

    // Create browser page
    page = await browserPool.createPage();
    
    // Set content and wait for fonts
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Enhanced font loading check
    await page.evaluate(() => {
      return Promise.all([
        document.fonts.ready,
        new Promise(resolve => {
          if (document.fonts.status === 'loaded') {
            resolve(true);
          } else {
            document.fonts.addEventListener('loadingdone', () => resolve(true));
            // Fallback timeout
            setTimeout(() => resolve(true), 2000);
          }
        })
      ]);
    });
    
    // Additional wait to ensure proper rendering
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take screenshot
    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: { 
        x: 0, 
        y: 0, 
        width: DESIGN_CONFIG.IMAGE.WIDTH, 
        height: DESIGN_CONFIG.IMAGE.HEIGHT 
      },
      omitBackground: false,
    });
    
    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="daily-quote.png"',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Determine error type and appropriate response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isValidationError = errorMessage.includes('validation');
    const isTimeoutError = errorMessage.includes('timeout');
    
    const errorResponse = {
      error: 'Failed to generate image',
      code: isValidationError ? 'VALIDATION_ERROR' : 
             isTimeoutError ? 'TIMEOUT_ERROR' : 
             'GENERATION_ERROR',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
    
    const status = isValidationError ? 400 : isTimeoutError ? 408 : 500;
    
    return NextResponse.json(errorResponse, { status });
  } finally {
    // Always clean up the page
    if (page) {
      try {
        await browserPool.closePage(page);
      } catch (cleanupError) {
        console.error('Error cleaning up page:', cleanupError);
      }
    }
  }
}