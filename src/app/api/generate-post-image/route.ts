import { NextRequest, NextResponse } from 'next/server';
import { generateQuoteTemplate } from '@/lib/template';
import { browserPool } from '@/lib/browser-pool';
import { DESIGN_CONFIG } from '@/config/design';
import { getQuotePosts } from '@/lib/supabase-database';

export async function POST(request: NextRequest) {
  let page = null;
  
  try {
    const requestBody = await request.json().catch(() => null);
    
    if (!requestBody || !requestBody.quotePostId) {
      return NextResponse.json(
        { error: 'Quote post ID is required', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // Get all quote posts and find the requested one
    const quotePosts = await getQuotePosts();
    const quotePost = quotePosts.find(qp => qp.id === requestBody.quotePostId);
    
    if (!quotePost) {
      return NextResponse.json(
        { error: 'Quote post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Convert to the format expected by the template generator
    const templateData = {
      coreValue: quotePost.coreValue.value,
      supportingValue: quotePost.supportingValue.value,
      quote: quotePost.quote.text,
      author: typeof quotePost.quote.author === 'string' ? quotePost.quote.author : (quotePost.quote.author?.name || '')
    };
    
    // Generate HTML template
    const html = generateQuoteTemplate(templateData);

    // Create browser page
    page = await browserPool.createPage();
    
    // Set content and wait for fonts with longer timeout
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Enhanced font loading check
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (page as any).evaluate(() => {
      return Promise.all([
        document.fonts.ready,
        new Promise<boolean>(resolve => {
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
        'Content-Disposition': `attachment; filename="quote-post-${quotePost.id}.png"`,
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error generating post image:', error);
    
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