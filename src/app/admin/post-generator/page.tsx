'use client';

import { useState } from 'react';

export default function PostGenerator() {
  const [text, setText] = useState('Test');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setImageUrl(null);
    
    try {
      const response = await fetch('/api/generate-text-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          style: 'basic'
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } else {
        console.error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <h1 className="text-4xl font-light text-white tracking-wider">Post Generator</h1>
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
          <p className="text-gray-400 text-lg font-light">
            Create custom Instagram posts with advanced text formatting
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-4"></div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Text Input and Guide */}
            <div className="space-y-8">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-3">
                  Custom Text
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none text-white placeholder-gray-400 transition-all duration-200"
                  rows={6}
                  placeholder="Enter your text here... Use *text* for italic, **text** for turquoise"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !text.trim()}
                  className="relative group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 text-black font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:text-gray-400"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">
                    {isGenerating ? 'Generating...' : 'Generate Image'}
                  </span>
                </button>
              </div>

              {/* Styling Guide */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium text-white mb-2">Guide</h3>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-300">
                      <code className="bg-gray-700 px-2 py-1 rounded text-yellow-400">*text*</code>
                      <span className="ml-3">results in</span>
                    </div>
                    <div className="text-gray-300 italic">italic text</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-gray-300">
                      <code className="bg-gray-700 px-2 py-1 rounded text-yellow-400">**text**</code>
                      <span className="ml-3">results in</span>
                    </div>
                    <div className="text-cyan-400 font-medium">turquoise text</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm text-center">
                    Combine formatting for creative typography effects
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Generated Image */}
            <div className="flex flex-col">
              {imageUrl ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-white mb-2">
                      Generated Image
                    </h3>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-2xl">
                      <img 
                        src={imageUrl} 
                        alt="Generated post"
                        className="w-full max-w-sm h-auto rounded shadow-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <a
                      href={imageUrl}
                      download="post-image.png"
                      className="relative group bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center space-x-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download Image</span>
                      </span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <svg className="h-24 w-24 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-light">Generated image will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}