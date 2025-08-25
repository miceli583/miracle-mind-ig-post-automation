import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { validateQuoteData, getFieldErrors } from '@/lib/validation';
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

    const validation = validateQuoteData(requestBody);
    
    if (!validation.success) {
      const fieldErrors = getFieldErrors(validation.error);
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          code: 'VALIDATION_ERROR',
          fields: fieldErrors 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedData = validation.data;
    const { coreValue, supportingValue, quote, author } = sanitizedData;

    return new ImageResponse(
      React.createElement('div', {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }
      },
        React.createElement('div', {
          style: {
            width: '1076px',
            height: '1346px',
            background: 'linear-gradient(45deg, #40E0D0 0%, #C41E3A 25%, #D4AF37 50%, #C41E3A 75%, #40E0D0 100%)',
            borderRadius: '24px',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        },
          React.createElement('div', {
            style: {
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '60px 40px',
              fontFamily: 'sans-serif',
            }
          },
            React.createElement('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flex: 1,
                justifyContent: 'space-between',
                maxWidth: '900px',
                height: '100%',
                paddingTop: '40px',
                paddingBottom: '20px',
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '40px',
                }
              },
                React.createElement('div', {
                  style: {
                    fontSize: '32px',
                    fontWeight: '500',
                    color: '#ffffff',
                    lineHeight: '1.2',
                    marginBottom: '25px',
                    textAlign: 'center',
                  }
                }, "Today's Anchor"),
                
                React.createElement('div', {
                  style: {
                    width: '500px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
                    marginBottom: '25px',
                  }
                }),
                
                React.createElement('div', {
                  style: {
                    fontSize: '36px',
                    fontWeight: '400',
                    color: '#ffffff',
                    lineHeight: '1.2',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }
                }, 'Core Value: ' + (coreValue || 'Freedom')),
                
                React.createElement('div', {
                  style: {
                    fontSize: '25px',
                    fontWeight: '300',
                    color: '#ffffff',
                    lineHeight: '1.2',
                    textAlign: 'center',
                    opacity: 0.8,
                  }
                }, 'Supporting Value: ' + (supportingValue || 'Vibrance'))
              ),
              
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxWidth: '850px',
                  margin: '0 auto',
                  marginBottom: '40px',
                }
              },
                React.createElement('div', {
                  style: {
                    fontSize: '68px',
                    fontWeight: '300',
                    color: '#ffffff',
                    lineHeight: '1.3',
                    textAlign: 'center',
                    marginBottom: '20px',
                  }
                }, '"' + (quote || 'Every moment is a fresh beginning, a chance to choose love over fear.') + '"'),
                
                React.createElement('div', {
                  style: {
                    fontSize: '20px',
                    fontWeight: '300',
                    color: '#cccccc',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    opacity: 0.8,
                  }
                }, '— ' + (author || 'Unknown'))
              ),
              
              React.createElement('div', { style: { height: '20px' } })
            ),
            
            React.createElement('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }
            },
              React.createElement('div', {
                style: {
                  width: '500px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
                  marginBottom: '20px',
                }
              }),
              
              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              },
                React.createElement('div', {
                  style: {
                    color: '#cccccc',
                    fontSize: '18px',
                    fontWeight: '300',
                    textAlign: 'center',
                  }
                }, '@miraclemind.live')
              )
            )
          )
        )
      ),
      {
        width: 1080,
        height: 1350,
      },
    );

  } catch (error) {
    console.error('Error generating image:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isValidationError = errorMessage.includes('validation');
    
    const errorResponse = {
      error: 'Failed to generate image',
      code: isValidationError ? 'VALIDATION_ERROR' : 'GENERATION_ERROR',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
    
    const status = isValidationError ? 400 : 500;
    
    return new Response(
      JSON.stringify(errorResponse), 
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}