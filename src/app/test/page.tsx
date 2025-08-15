'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { QuoteData, FormErrors, LoadingState } from '@/types/quote';
import { DESIGN_CONFIG } from '@/config/design';

export default function TestPage() {
  const [formData, setFormData] = useState<QuoteData>({
    coreValue: 'Authenticity',
    supportingValue: 'Be true to yourself',
    quote: 'The privilege of a lifetime is being who you are.',
    author: 'Joseph Campbell'
  });
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isGenerating: false
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const validateField = (field: keyof QuoteData, value: string) => {
    const limits = DESIGN_CONFIG.LIMITS;
    
    switch (field) {
      case 'coreValue':
        if (value.length < limits.CORE_VALUE.MIN) return 'Core value is required';
        if (value.length > limits.CORE_VALUE.MAX) return `Maximum ${limits.CORE_VALUE.MAX} characters`;
        break;
      case 'supportingValue':
        if (value.length < limits.SUPPORTING_VALUE.MIN) return 'Supporting value is required';
        if (value.length > limits.SUPPORTING_VALUE.MAX) return `Maximum ${limits.SUPPORTING_VALUE.MAX} characters`;
        break;
      case 'quote':
        if (value.length < limits.QUOTE.MIN) return `Minimum ${limits.QUOTE.MIN} characters`;
        if (value.length > limits.QUOTE.MAX) return `Maximum ${limits.QUOTE.MAX} characters`;
        break;
      case 'author':
        if (value.length > limits.AUTHOR.MAX) return `Maximum ${limits.AUTHOR.MAX} characters`;
        break;
    }
    return '';
  };

  const handleInputChange = (field: keyof QuoteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    setSuccessMessage('');
  };

  const handleGenerate = async () => {
    
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof QuoteData, value || '');
      if (error) newErrors[key as keyof FormErrors] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoadingState({
      isGenerating: true,
      progress: 10,
      message: 'Validating input...'
    });
    
    try {
      setLoadingState(prev => ({ ...prev, progress: 30, message: 'Generating template...' }));
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setLoadingState(prev => ({ ...prev, progress: 70, message: 'Processing image...' }));
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Clean up previous URL
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
        
        setImageUrl(url);
        setSuccessMessage('Image generated successfully!');
        setLoadingState(prev => ({ ...prev, progress: 100, message: 'Complete!' }));
      } else {
        const errorData = await response.json();
        
        if (errorData.fields) {
          setErrors(errorData.fields);
        } else {
          setErrors({ quote: errorData.error || 'Failed to generate image' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ quote: 'Network error. Please try again.' });
    } finally {
      setTimeout(() => {
        setLoadingState({ isGenerating: false });
      }, 500);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const getCharacterCount = (field: keyof QuoteData) => {
    const value = formData[field] || '';
    const limits = DESIGN_CONFIG.LIMITS;
    
    let limit;
    switch (field) {
      case 'coreValue':
        limit = limits.CORE_VALUE;
        break;
      case 'supportingValue':
        limit = limits.SUPPORTING_VALUE;
        break;
      case 'quote':
        limit = limits.QUOTE;
        break;
      case 'author':
        limit = limits.AUTHOR;
        break;
      default:
        limit = { MAX: 100 };
    }
    
    return { current: value.length, max: limit.MAX, isValid: value.length <= limit.MAX };
  };

  const CharacterCounter = ({ field }: { field: keyof QuoteData }) => {
    const { current, max, isValid } = getCharacterCount(field);
    return (
      <div className={`text-sm ${isValid ? 'text-gray-500' : 'text-red-500'}`}>
        {current}/{max} characters
      </div>
    );
  };

  const InputField = ({ 
    field, 
    label, 
    type = 'text', 
    rows 
  }: { 
    field: keyof QuoteData; 
    label: string; 
    type?: 'text' | 'textarea';
    rows?: number;
  }) => {
    const error = errors[field];
    const { isValid } = getCharacterCount(field);
    
    const inputClasses = `w-full p-3 border-2 rounded-lg focus:ring-2 focus:outline-none text-gray-900 text-base transition-colors ${
      error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
        : isValid 
        ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        : 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200'
    }`;
    
    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-gray-800">{label}</label>
          <CharacterCounter field={field} />
        </div>
        {type === 'textarea' ? (
          <textarea
            value={formData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={rows}
            className={inputClasses}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type="text"
            value={formData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={inputClasses}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Miracle Mind Image Generator
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Create beautiful, branded quote images for social media
          </p>
        </div>
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {successMessage}
          </div>
        )}
        
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Configure Your Quote</h2>
            </div>
            
            <div className="space-y-6">
              <InputField field="coreValue" label="Core Value" />
              <InputField field="supportingValue" label="Supporting Value" />
              <InputField field="quote" label="Quote" type="textarea" rows={4} />
              <InputField field="author" label="Author (optional)" />
              
              {loadingState.isGenerating && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{loadingState.message}</span>
                    <span>{loadingState.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${loadingState.progress || 0}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={() => handleGenerate()}
                disabled={loadingState.isGenerating || Object.keys(errors).some(key => errors[key as keyof FormErrors])}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {loadingState.isGenerating ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Generated Image</h2>
            
            {imageUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={imageUrl}
                    alt="Generated quote image"
                    width={540}
                    height={675}
                    className="w-full border-2 border-gray-200 rounded-lg shadow-md"
                    priority
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={imageUrl}
                    download="daily-quote.png"
                    className="flex-1 text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    📥 Download PNG
                  </a>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ 
                          title: 'Miracle Mind Quote',
                          text: 'Check out this inspirational quote!',
                          url: window.location.href
                        });
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-80 sm:h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">🎨</div>
                <div className="text-lg font-medium text-center px-4">
                  {loadingState.isGenerating 
                    ? 'Creating your masterpiece...' 
                    : 'Click Generate to see your quote image'
                  }
                </div>
                {!loadingState.isGenerating && (
                  <div className="text-sm text-gray-400 mt-2 text-center px-4">
                    Perfect for Instagram posts • 1080×1350px
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Fast Generation</h3>
              <p className="text-sm text-gray-300">Optimized browser pooling for quick image creation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold mb-2">Secure & Validated</h3>
              <p className="text-sm text-gray-300">Input validation and XSS protection built-in</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">Instagram Ready</h3>
              <p className="text-sm text-gray-300">Perfect dimensions and branding for social media</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}