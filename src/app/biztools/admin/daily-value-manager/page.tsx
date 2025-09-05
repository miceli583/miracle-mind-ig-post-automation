'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  coreValues: number;
  supportingValues: number;
  quotes: number;
  posts: number;
  publishedPosts: number;
}

export default function DailyValueManagerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="border-4 border-dashed border-gray-800 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="text-center space-y-4 py-12">
        <div className="inline-flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <h1 className="text-4xl font-light text-white tracking-wider">Daily Value Manager</h1>
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        <p className="text-gray-400 text-lg font-light">
          Manage your inspirational content library and generate daily posts
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 px-6 pb-12">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">CV</span>
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-400 truncate">
                  Core Values
                </dt>
                <dd className="text-2xl font-bold text-white">
                  {stats.coreValues}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">SV</span>
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-400 truncate">
                  Supporting Values
                </dt>
                <dd className="text-2xl font-bold text-white">
                  {stats.supportingValues}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">Q</span>
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-400 truncate">
                  Quotes
                </dt>
                <dd className="text-2xl font-bold text-white">
                  {stats.quotes}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-400 truncate">
                  Total Posts
                </dt>
                <dd className="text-2xl font-bold text-white">
                  {stats.posts}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">✓</span>
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-sm font-medium text-gray-400 truncate">
                  Published
                </dt>
                <dd className="text-2xl font-bold text-white">
                  {stats.publishedPosts}
                </dd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Sidebar and Management Tools Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen border-r border-gray-800">
          <div className="p-6">
            <nav className="space-y-2">
              <a
                href="/biztools/admin/daily-value-manager/values"
                className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Values</span>
              </a>
              <a
                href="/biztools/admin/daily-value-manager/image-gen"
                className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Image Generator</span>
              </a>
              <a
                href="/biztools/admin/daily-value-manager/posts"
                className="flex items-center space-x-3 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Posts</span>
              </a>
            </nav>
          </div>
        </div>
        
        {/* Management Tools Content */}
        <div className="flex-1 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl font-light text-white tracking-wide">Management Tools</h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
          <a
            href="/biztools/admin/daily-value-manager/values"
            className="group relative block bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700 rounded-2xl p-10 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-yellow-400/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center space-x-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 mb-3">
                  Core & Supporting Values
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-lg leading-relaxed">
                  Manage your foundational values and their thematic relationships
                </p>
              </div>
              
              <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </a>


          <a
            href="/biztools/admin/daily-value-manager/image-gen"
            className="group relative block bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700 rounded-2xl p-10 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-yellow-400/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center space-x-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 mb-3">
                  Create Post Images
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-lg leading-relaxed">
                  Design beautiful inspirational images for social media
                </p>
              </div>
              
              <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </a>

          <a
            href="/biztools/admin/daily-value-manager/posts"
            className="group relative block bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700 rounded-2xl p-10 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-yellow-400/10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center space-x-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 mb-3">
                  Post Queue
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-lg leading-relaxed">
                  Manage your generated posts ready for publishing
                </p>
              </div>
              
              <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </a>
            </div>
            
            {/* Footer */}
            <div className="text-center pt-12">
              <div className="inline-flex items-center space-x-3 text-gray-500">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
                <span className="text-sm font-light">Streamlined content management for consistent brand messaging</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}