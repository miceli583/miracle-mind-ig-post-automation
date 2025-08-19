'use client';

import { useState } from 'react';

interface QuoteData {
  coreValue: string;
  supportingValue: string;
  quote: string;
  author: string;
}

interface LoadingState {
  isGenerating: boolean;
  progress?: number;
  message?: string;
}

export default function ImageGenerator() {
  const [formData, setFormData] = useState<QuoteData>({
    coreValue: '',
    supportingValue: '',
    quote: '',
    author: ''
  });
  const [loadingState, setLoadingState] = useState<LoadingState>({ isGenerating: false });
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleInputChange = (field: keyof QuoteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRandomPost = async () => {
    try {
      setLoadingState({ isGenerating: true, message: 'Generating random thematic combination...' });
      
      const response = await fetch('/api/generate-random-post-relational', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          coreValue: data.preview.coreValue,
          supportingValue: data.preview.supportingValue,
          quote: data.preview.quote,
          author: data.preview.author
        });
        setLoadingState({ isGenerating: false });
      } else {
        throw new Error('Failed to generate random post');
      }
    } catch (error) {
      console.error('Error generating random post:', error);
      setLoadingState({ isGenerating: false });
      alert('Failed to generate random post. Make sure you have imported your data first.');
    }
  };

  const generateImage = async () => {
    if (!formData.coreValue || !formData.supportingValue || !formData.quote) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoadingState({ isGenerating: true, message: 'Generating your image...' });
      setImageUrl('');

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setLoadingState({ isGenerating: false });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setLoadingState({ isGenerating: false });
      alert('Failed to generate image. Please try again.');
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'daily-quote.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Image Generator
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Generate beautiful quote images for your social media posts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quote Content
            </h3>
            
            <div className="mb-4">
              <button
                onClick={generateRandomPost}
                disabled={loadingState.isGenerating}
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mb-6"
              >
                {loadingState.isGenerating && loadingState.message?.includes('random') 
                  ? 'Generating Random Combination...' 
                  : 'Generate Random Thematic Combination'
                }
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="coreValue" className="block text-sm font-medium text-gray-700">
                  Core Value *
                </label>
                <input
                  type="text"
                  id="coreValue"
                  value={formData.coreValue}
                  onChange={(e) => handleInputChange('coreValue', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Growth, Balance, Freedom"
                />
              </div>

              <div>
                <label htmlFor="supportingValue" className="block text-sm font-medium text-gray-700">
                  Supporting Value *
                </label>
                <input
                  type="text"
                  id="supportingValue"
                  value={formData.supportingValue}
                  onChange={(e) => handleInputChange('supportingValue', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Curiosity, Patience, Courage"
                />
              </div>

              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
                  Quote *
                </label>
                <textarea
                  id="quote"
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => handleInputChange('quote', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your inspirational quote..."
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Ralph Waldo Emerson (optional)"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={generateImage}
                disabled={loadingState.isGenerating}
                className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loadingState.isGenerating && loadingState.message?.includes('image') 
                  ? 'Generating Image...' 
                  : 'Generate Image'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Preview/Output */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Generated Image
            </h3>
            
            {loadingState.isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-sm text-gray-500">{loadingState.message}</p>
              </div>
            ) : imageUrl ? (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Generated quote image"
                    className="w-full h-auto"
                  />
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Download Image
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Your generated image will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for Better Images</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use the "Generate Random Combination" to get thematically matched content</li>
          <li>• Keep quotes under 200 characters for better readability</li>
          <li>• Core values and supporting values should be single words or short phrases</li>
          <li>• Author attribution helps build credibility for your content</li>
          <li>• Generated images are optimized for Instagram posts (1080x1080px)</li>
        </ul>
      </div>
    </div>
  );
}