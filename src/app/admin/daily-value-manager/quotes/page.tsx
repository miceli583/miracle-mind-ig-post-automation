'use client';

import { useEffect, useState } from 'react';
import type { QuoteWithAuthor, Author, CoreValue, CoreValueQuote } from '@/types/database-relational';

interface ExtendedQuoteWithAuthor extends QuoteWithAuthor {
  coreValueIds?: string[];
  coreValueNames?: string[];
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<ExtendedQuoteWithAuthor[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [relationships, setRelationships] = useState<CoreValueQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'quotes' | 'authors'>('quotes');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch basic data
      const [quotesResponse, authorsResponse, coreValuesResponse] = await Promise.all([
        fetch('/api/admin/quotes-relational'),
        fetch('/api/admin/authors'),
        fetch('/api/admin/core-values')
      ]);

      let quotesData = [];
      if (quotesResponse.ok) {
        quotesData = await quotesResponse.json();
      }

      if (authorsResponse.ok) {
        const authorsData = await authorsResponse.json();
        setAuthors(authorsData);
      }

      if (coreValuesResponse.ok) {
        const coreValuesData = await coreValuesResponse.json();
        setCoreValues(coreValuesData);
      }

      // Fetch database structure to get relationships
      try {
        const dbResponse = await fetch('/api/admin/debug/db-structure');
        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          
          if (dbData.coreValueQuotes && dbData.coreValues) {
            setRelationships(dbData.coreValueQuotes);
            
            // Enhance quotes with core value relationships
            const enhancedQuotes = quotesData.map((quote: QuoteWithAuthor) => {
              const relatedCoreValueIds = dbData.coreValueQuotes
                .filter((rel: CoreValueQuote) => rel.quoteId === quote.id)
                .map((rel: CoreValueQuote) => rel.coreValueId);
              
              const relatedCoreValueNames = relatedCoreValueIds
                .map((id: string) => dbData.coreValues.find((cv: CoreValue) => cv.id === id)?.value)
                .filter(Boolean);
              
              return {
                ...quote,
                coreValueIds: relatedCoreValueIds,
                coreValueNames: relatedCoreValueNames
              };
            });
            setQuotes(enhancedQuotes);
          } else {
            setQuotes(quotesData);
          }
        } else {
          setQuotes(quotesData);
        }
      } catch (err) {
        console.log('Could not fetch relationship data:', err);
        setQuotes(quotesData);
      }
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = async (text: string, authorId?: string, category?: string, coreValueId?: string) => {
    try {
      const response = await fetch('/api/admin/quotes-relational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, authorId, category, coreValueId, isActive: true })
      });

      if (response.ok) {
        setShowQuoteForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create quote:', error);
    }
  };

  const handleCreateAuthor = async (name: string) => {
    try {
      const response = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isActive: true })
      });

      if (response.ok) {
        setShowAuthorForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create author:', error);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      const response = await fetch(`/api/admin/quotes-relational/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;

    try {
      const response = await fetch(`/api/admin/authors/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete author:', error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading quotes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Manage Quotes & Authors
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Organize your quote library with proper author attribution
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quotes ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('authors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'authors'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Authors ({authors.length})
          </button>
        </nav>
      </div>

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Quotes</h3>
            <button
              onClick={() => setShowQuoteForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Quote
            </button>
          </div>

          {showQuoteForm && (
            <QuoteForm
              authors={authors}
              coreValues={coreValues}
              onSubmit={handleCreateQuote}
              onCancel={() => setShowQuoteForm(false)}
            />
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <li key={quote.id}>
                  <div className="px-4 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <p className="text-sm text-gray-900 mb-2">
                          "{quote.text}"
                        </p>
                        {quote.author && (
                          <p className="text-sm text-gray-500 mb-1">
                            — {quote.author.name}
                          </p>
                        )}
                        {quote.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {quote.category}
                          </span>
                        )}
                        {quote.coreValueNames && quote.coreValueNames.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Linked to Core Values:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {quote.coreValueNames.map((cvName, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {cvName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {(!quote.coreValueNames || quote.coreValueNames.length === 0) && (
                          <p className="mt-2 text-xs text-amber-600">
                            ⚠️ Not linked to any core value
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {quotes.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                  No quotes yet. Add one to get started or import your data.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Authors Tab */}
      {activeTab === 'authors' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Authors</h3>
            <button
              onClick={() => setShowAuthorForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Author
            </button>
          </div>

          {showAuthorForm && (
            <AuthorForm
              onSubmit={handleCreateAuthor}
              onCancel={() => setShowAuthorForm(false)}
            />
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {authors.map((author) => (
                <li key={author.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {author.name}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDeleteAuthor(author.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {authors.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                  No authors yet. Add one to get started or import your data.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function QuoteForm({ 
  authors, 
  coreValues,
  onSubmit, 
  onCancel 
}: { 
  authors: Author[];
  coreValues: CoreValue[];
  onSubmit: (text: string, authorId?: string, category?: string, coreValueId?: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [category, setCategory] = useState('');
  const [coreValueId, setCoreValueId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim(), authorId || undefined, category.trim() || undefined, coreValueId || undefined);
      setText('');
      setAuthorId('');
      setCategory('');
      setCoreValueId('');
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg mb-6">
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Add New Quote
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Quote Text *
            </label>
            <textarea
              id="text"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter the quote text"
              required
            />
          </div>
          <div>
            <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <select
              id="authorId"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select an author (optional)</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="coreValueId" className="block text-sm font-medium text-gray-700">
              Link to Core Value
            </label>
            <select
              id="coreValueId"
              value={coreValueId}
              onChange={(e) => setCoreValueId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a core value (optional)</option>
              {coreValues.map(cv => (
                <option key={cv.id} value={cv.id}>{cv.value}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Link this quote to a core value to show thematic relationships
            </p>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Wisdom & Insight"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Quote
          </button>
        </div>
      </form>
    </div>
  );
}

function AuthorForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg mb-6">
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Add New Author
        </h3>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Author Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter author name"
            required
          />
        </div>
        <div className="mt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Author
          </button>
        </div>
      </form>
    </div>
  );
}