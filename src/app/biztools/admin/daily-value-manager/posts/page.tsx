'use client';

import { useEffect, useState } from 'react';
import type { QuotePostWithData } from '@/types/database-relational';

export default function PostsPage() {
  const [posts, setPosts] = useState<QuotePostWithData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts-relational');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPost = async () => {
    try {
      const response = await fetch('/api/generate-random-post-relational', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Generated new post: ${data.preview.coreValue} + ${data.preview.supportingValue}`);
        fetchPosts();
      } else {
        alert('Failed to generate random post. Make sure you have imported your data first.');
      }
    } catch (error) {
      console.error('Error generating random post:', error);
      alert('Failed to generate random post');
    }
  };

  const generateImageForPost = async (post: QuotePostWithData) => {
    try {
      const response = await fetch('/api/generate-post-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotePostId: post.id }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quote-post-${post.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Failed to generate image for this post');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="text-center space-y-4 py-12">
        <div className="inline-flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <h1 className="text-4xl font-light text-white tracking-wider">Post Queue</h1>
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        <p className="text-gray-400 text-lg font-light">
          Manage your generated posts ready for publishing
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={generateRandomPost}
              className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-transparent rounded-xl shadow-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 ease-out hover:shadow-xl hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Generate Random Thematic Post</span>
              </div>
            </button>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-2xl hover:border-gray-700 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        {post.coreValue.value}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {post.supportingValue.value}
                      </span>
                      {post.isPublished && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                          Published
                        </span>
                      )}
                    </div>
                    <blockquote className="text-white text-lg font-medium leading-relaxed mb-3 italic">
                      &quot;{post.quote.text}&quot;
                    </blockquote>
                    {post.quote.author && (
                      <p className="text-gray-400 text-sm mb-3 font-medium">
                        — {post.quote.author.name}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => generateImageForPost(post)}
                      className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border border-transparent rounded-xl shadow-lg py-3 px-6 text-sm font-semibold text-black transition-all duration-300 ease-out hover:shadow-xl hover:shadow-yellow-400/25 transform hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Generate Image</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium mb-2">No posts yet</p>
                <p className="text-gray-500 text-sm">Generate a random post to get started</p>
              </div>
            )}
          </div>

          {posts.length > 0 && (
            <div className="mt-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-white">About Your Posts</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-gray-300 space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Each post combines core value, supporting value, and thematically related quote</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use &quot;Generate Image&quot; to create social media-ready visuals</span>
                  </li>
                </ul>
                <ul className="text-sm text-gray-300 space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Posts maintain thematic coherence based on imported relationships</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>All combinations respect author attributions from original data</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}