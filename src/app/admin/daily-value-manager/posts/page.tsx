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
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Manage Posts
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Create, schedule, and publish your quote posts
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={generateRandomPost}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Generate Random Thematic Post
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.coreValue.value}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {post.supportingValue.value}
                      </span>
                      {post.isPublished && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Published
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 mb-2">
                      "{post.quote.text}"
                    </p>
                    {post.quote.author && (
                      <p className="text-sm text-gray-500 mb-2">
                        — {post.quote.author.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 space-y-2">
                    <button
                      onClick={() => generateImageForPost(post)}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      Generate Image
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No posts yet. Generate a random post to get started.
            </li>
          )}
        </ul>
      </div>

      {posts.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 About Your Posts</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Each post combines a core value, supporting value, and thematically related quote</li>
            <li>• Use "Generate Image" to create social media-ready visuals</li>
            <li>• Posts maintain thematic coherence based on your imported relationships</li>
            <li>• All combinations respect the author attributions from your original data</li>
          </ul>
        </div>
      )}
    </div>
  );
}