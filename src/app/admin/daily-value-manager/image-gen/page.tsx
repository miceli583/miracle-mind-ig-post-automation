'use client';

import { useState } from 'react';

interface QuoteData {
  coreValue: string;
  supportingValue: string;
  quote: string;
  author: string;
  style: string;
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
    author: '',
    style: 'style1'
  });

  const imageStyles = [
    { id: 'style1', name: 'Style 1', description: 'Classic elegant design with gradient background' },
    { id: 'style2', name: 'Style 2', description: 'Modern dark theme matching app aesthetic' }
  ];
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
        setFormData(prev => ({
          ...prev,
          coreValue: data.preview.coreValue,
          supportingValue: data.preview.supportingValue,
          quote: data.preview.quote,
          author: data.preview.author
        }));
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
        body: JSON.stringify({
          coreValue: formData.coreValue,
          supportingValue: formData.supportingValue,
          quote: formData.quote,
          author: formData.author,
          style: formData.style
        }),
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
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="text-center space-y-4 py-12">
        <div className="inline-flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <h1 className="text-4xl font-light text-white tracking-wider">Image Generator</h1>
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        <p className="text-gray-400 text-lg font-light">
          Design beautiful inspirational images for social media
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Quote Content
              </h3>
            </div>
            
            <div className="mb-6">
              <button
                onClick={generateRandomPost}
                disabled={loadingState.isGenerating}
                className="group relative w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-transparent rounded-xl shadow-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 ease-out hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>
                    {loadingState.isGenerating && loadingState.message?.includes('random') 
                      ? 'Generating Random Combination...' 
                      : 'Generate Random Thematic Combination'
                    }
                  </span>
                </div>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="coreValue" className="block text-sm font-medium text-gray-300 mb-2">
                  Core Value <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="coreValue"
                  value={formData.coreValue}
                  onChange={(e) => handleInputChange('coreValue', e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 hover:border-gray-600"
                  placeholder="e.g., Growth, Balance, Freedom"
                />
              </div>

              <div>
                <label htmlFor="supportingValue" className="block text-sm font-medium text-gray-300 mb-2">
                  Supporting Value <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="supportingValue"
                  value={formData.supportingValue}
                  onChange={(e) => handleInputChange('supportingValue', e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 hover:border-gray-600"
                  placeholder="e.g., Curiosity, Patience, Courage"
                />
              </div>

              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-gray-300 mb-2">
                  Quote <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="quote"
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => handleInputChange('quote', e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 hover:border-gray-600 resize-none"
                  placeholder="Enter your inspirational quote..."
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                  Author <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 hover:border-gray-600"
                  placeholder="e.g., Ralph Waldo Emerson"
                />
              </div>

              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
                  Image Style
                </label>
                <select
                  id="style"
                  value={formData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 hover:border-gray-600"
                >
                  {imageStyles.map((style) => (
                    <option key={style.id} value={style.id} className="bg-gray-800 text-white">
                      {style.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {imageStyles.find(s => s.id === formData.style)?.description}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={generateImage}
                disabled={loadingState.isGenerating}
                className="group relative w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border border-transparent rounded-xl shadow-lg py-4 px-6 text-lg font-semibold text-black transition-all duration-300 ease-out hover:shadow-xl hover:shadow-yellow-400/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {loadingState.isGenerating && loadingState.message?.includes('image') 
                      ? 'Generating Image...' 
                      : 'Generate Image'
                    }
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Preview/Output */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Generated Image
              </h3>
            </div>
            
            {loadingState.isGenerating ? (
              <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                <p className="mt-4 text-sm text-gray-300 font-medium">{loadingState.message}</p>
              </div>
            ) : imageUrl ? (
              <div className="space-y-6">
                <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/30 p-2">
                  <img
                    src={imageUrl}
                    alt="Generated quote image"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <button
                  onClick={downloadImage}
                  className="group relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border border-transparent rounded-xl shadow-lg py-3 px-6 text-sm font-semibold text-white transition-all duration-300 ease-out hover:shadow-xl hover:shadow-green-500/25 transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Image</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">
                    Your generated image will appear here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in the form and click "Generate Image" to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white">Tips for Better Images</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use "Generate Random Combination" for thematically matched content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep quotes under 200 characters for better readability</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use single words or short phrases for values</span>
                </li>
              </ul>
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Author attribution builds content credibility</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Images are optimized for Instagram (1080x1080px)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Preview updates show your content in real-time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}