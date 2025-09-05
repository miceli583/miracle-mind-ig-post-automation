import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React from 'react';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json().catch(() => null);
    
    if (!requestBody) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', code: 'INVALID_JSON' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { text, style = 'basic' } = requestBody;

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required', code: 'MISSING_TEXT' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Basic style configuration
    const getTextFontSize = (text: string) => {
      const length = text.length;
      if (length <= 10) return '120px';
      if (length <= 20) return '100px';
      if (length <= 40) return '80px';
      if (length <= 80) return '60px';
      return '48px';
    };

    const fontSize = getTextFontSize(text);

    // Parse text for markup: *italic* and **turquoise**
    const parseTextWithMarkup = (text: string) => {
      // Split by both markups while preserving all content including spaces
      let result = [];
      let currentIndex = 0;
      
      // Find all markup patterns
      const markupRegex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
      let match;
      
      while ((match = markupRegex.exec(text)) !== null) {
        // Add text before the markup
        if (match.index > currentIndex) {
          const beforeText = text.slice(currentIndex, match.index);
          result.push(React.createElement('span', {
            key: `text-${currentIndex}`,
            style: { color: '#ffffff', fontStyle: 'normal' }
          }, beforeText));
        }
        
        const markup = match[0];
        if (markup.startsWith('**') && markup.endsWith('**')) {
          // Turquoise text
          result.push(React.createElement('span', {
            key: `turquoise-${match.index}`,
            style: { color: '#40E0D0', fontStyle: 'normal' }
          }, markup.slice(2, -2)));
        } else if (markup.startsWith('*') && markup.endsWith('*')) {
          // Italic text
          result.push(React.createElement('span', {
            key: `italic-${match.index}`,
            style: { color: '#ffffff', fontStyle: 'italic' }
          }, markup.slice(1, -1)));
        }
        
        currentIndex = match.index + markup.length;
      }
      
      // Add remaining text after last markup
      if (currentIndex < text.length) {
        const remainingText = text.slice(currentIndex);
        result.push(React.createElement('span', {
          key: `text-${currentIndex}`,
          style: { color: '#ffffff', fontStyle: 'normal' }
        }, remainingText));
      }
      
      return result;
    };

    return new ImageResponse(
      React.createElement('div', {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          padding: '60px',
        }
      },
        React.createElement('div', {
          style: {
            fontSize: fontSize,
            fontWeight: '400',
            color: '#ffffff',
            textAlign: 'left',
            fontFamily: 'Times New Roman, serif',
            lineHeight: '1.3',
            wordWrap: 'break-word',
            maxWidth: '800px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }
        }, ...parseTextWithMarkup(text))
      ),
      {
        width: 1080,
        height: 1350,
      }
    );

  } catch (error) {
    console.error('Error generating text image:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const errorResponse = {
      error: 'Failed to generate image',
      code: 'GENERATION_ERROR',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
    
    return new Response(
      JSON.stringify(errorResponse), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}