'use client';

export default function AdminOverview() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <h1 className="text-4xl font-light text-white tracking-wider">Miracle Mind Tooling</h1>
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        <p className="text-gray-400 text-lg font-light">
          All-in-one business automation and content management hub
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="relative">
            <a
              href="/biztools/admin/daily-value-manager"
              className="group relative block bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700 rounded-2xl p-10 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-yellow-400/10"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center space-x-8">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    {/* Accent dots */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 mb-3">
                    Daily Value Manager
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-lg leading-relaxed mb-4">
                    Content management system for inspirational values, quotes, and automated Instagram post generation
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Content Management</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Image Generation</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Social Automation</span>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

          <div className="relative">
            <a
              href="/biztools/admin/post-generator"
              className="group relative block bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700 rounded-2xl p-10 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-cyan-400/10"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center space-x-8">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Accent dots */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 mb-3">
                    Post Generator
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-lg leading-relaxed mb-4">
                    Create custom Instagram posts with advanced text formatting and typography options
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Text Formatting</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Custom Typography</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">Instagram Ready</span>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-12">
        <div className="inline-flex items-center space-x-3 text-gray-500">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
          <span className="text-sm font-light">Additional business tools will be integrated as modular features</span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
        </div>
      </div>
    </div>
  );
}