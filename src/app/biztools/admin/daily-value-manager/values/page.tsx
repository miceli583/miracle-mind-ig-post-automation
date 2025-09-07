'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CoreValue, SupportingValue, QuoteWithAuthor, Author } from '@/types/database-relational';

interface ExtendedSupportingValue extends SupportingValue {
  coreValueIds?: string[];
  coreValueNames?: string[];
}

interface ExtendedQuote extends QuoteWithAuthor {
  coreValueIds?: string[];
  coreValueNames?: string[];
}

function ValuesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [supportingValues, setSupportingValues] = useState<ExtendedSupportingValue[]>([]);
  const [quotes, setQuotes] = useState<ExtendedQuote[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get current tab from URL, with fallback to 'core'
  const getCurrentTab = (): 'core' | 'supporting' | 'quotes' => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'supporting' || tabParam === 'quotes') {
      return tabParam;
    }
    return 'core';
  };
  
  // Use URL as single source of truth for active tab
  const activeTab = getCurrentTab();
  
  // Form states
  const [showCoreForm, setShowCoreForm] = useState(false);
  const [showSupportingForm, setShowSupportingForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingCore, setEditingCore] = useState<CoreValue | null>(null);
  const [editingSupporting, setEditingSupporting] = useState<ExtendedSupportingValue | null>(null);
  const [editingQuote, setEditingQuote] = useState<ExtendedQuote | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle tab changes with URL update
  const handleTabChange = (tab: 'core' | 'supporting' | 'quotes') => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'core') {
      // Remove tab param for core (default), keeps URL clean
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchData = async () => {
    try {
      // First fetch core values and authors
      const [coreValuesRes, authorsRes] = await Promise.all([
        fetch('/api/admin/core-values'),
        fetch('/api/admin/authors')
      ]);

      const [coreValuesData, authorsData] = await Promise.all([
        coreValuesRes.json(),
        authorsRes.json()
      ]);

      setCoreValues(coreValuesData || []);
      setAuthors(authorsData || []);

      // Now fetch supporting values and quotes with enhanced relationship data
      const [supportingValuesRes, quotesRes] = await Promise.all([
        fetch('/api/admin/supporting-values'),
        fetch('/api/admin/quotes-relational')
      ]);

      const [supportingValuesData, quotesData] = await Promise.all([
        supportingValuesRes.json(),
        quotesRes.json()
      ]);

      // Enhanced supporting values with core value relationships
      // Note: This requires updating the API to return relationship data or fetching separately
      setSupportingValues(supportingValuesData || []);
      setQuotes(quotesData || []);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCore = async (value: string, description?: string) => {
    try {
      const response = await fetch('/api/admin/core-values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, description, isActive: true })
      });
      if (response.ok) {
        setShowCoreForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create core value:', error);
    }
  };

  const handleCreateSupporting = async (value: string, description?: string, coreValueIds?: string[]) => {
    try {
      const response = await fetch('/api/admin/supporting-values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, description, coreValueIds, isActive: true })
      });
      if (response.ok) {
        setShowSupportingForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create supporting value:', error);
    }
  };

  const handleUpdateCore = async (id: string, value: string, description?: string) => {
    try {
      const response = await fetch(`/api/admin/core-values/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, description, isActive: true })
      });
      if (response.ok) {
        setEditingCore(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update core value:', error);
    }
  };

  const handleArchiveCore = async (id: string) => {
    if (!confirm('Are you sure you want to archive this core value?')) return;
    
    try {
      const response = await fetch(`/api/admin/core-values/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to archive core value:', error);
    }
  };

  const handleDeleteCore = async (id: string) => {
    if (!confirm('Are you sure you want to delete this core value?')) return;
    
    try {
      const response = await fetch(`/api/admin/core-values/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete core value:', error);
    }
  };

  const handleUpdateSupporting = async (id: string, value: string, description?: string, coreValueIds?: string[]) => {
    try {
      const response = await fetch(`/api/admin/supporting-values/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, description, coreValueIds, isActive: true })
      });
      if (response.ok) {
        setEditingSupporting(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update supporting value:', error);
    }
  };

  const handleArchiveSupporting = async (id: string) => {
    if (!confirm('Are you sure you want to archive this supporting value?')) return;
    
    try {
      const response = await fetch(`/api/admin/supporting-values/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to archive supporting value:', error);
    }
  };

  const handleDeleteSupporting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supporting value?')) return;
    
    try {
      const response = await fetch(`/api/admin/supporting-values/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete supporting value:', error);
    }
  };

  // Quote handlers
  const handleCreateQuote = async (text: string, authorName?: string, coreValueIds?: string[]) => {
    try {
      // First, create or find the author if provided
      let authorId = undefined;
      if (authorName?.trim()) {
        // Check if author exists
        const existingAuthor = authors.find(a => a.name.toLowerCase() === authorName.toLowerCase());
        if (existingAuthor) {
          authorId = existingAuthor.id;
        } else {
          // Create new author
          const authorResponse = await fetch('/api/admin/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: authorName.trim(), isActive: true })
          });
          if (authorResponse.ok) {
            const newAuthor = await authorResponse.json();
            authorId = newAuthor.id;
          }
        }
      }

      const response = await fetch('/api/admin/quotes-relational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          authorId, 
          coreValueIds, 
          isActive: true 
        })
      });
      if (response.ok) {
        setShowQuoteForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create quote:', error);
    }
  };

  const handleUpdateQuote = async (id: string, text: string, authorName?: string, coreValueIds?: string[]) => {
    try {
      // Handle author creation/update similar to create
      let authorId = undefined;
      if (authorName?.trim()) {
        const existingAuthor = authors.find(a => a.name.toLowerCase() === authorName.toLowerCase());
        if (existingAuthor) {
          authorId = existingAuthor.id;
        } else {
          const authorResponse = await fetch('/api/admin/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: authorName.trim(), isActive: true })
          });
          if (authorResponse.ok) {
            const newAuthor = await authorResponse.json();
            authorId = newAuthor.id;
          }
        }
      }

      const response = await fetch(`/api/admin/quotes-relational/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, authorId, coreValueIds, isActive: true })
      });
      if (response.ok) {
        setEditingQuote(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  const handleArchiveQuote = async (id: string) => {
    if (!confirm('Are you sure you want to archive this quote?')) return;
    
    try {
      const response = await fetch(`/api/admin/quotes-relational/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to archive quote:', error);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      const response = await fetch(`/api/admin/quotes-relational/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-800 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading values...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-800 mb-6">
        <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate mb-4">
          Values Management
        </h2>
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('core')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'core'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Core Values ({coreValues.length})
          </button>
          <button
            onClick={() => handleTabChange('supporting')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'supporting'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Supporting Values ({supportingValues.length})
          </button>
          <button
            onClick={() => handleTabChange('quotes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotes'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Quotes ({quotes.length})
          </button>
        </nav>
      </div>

      {/* Core Values Tab */}
      {activeTab === 'core' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Core Values</h3>
            <button
              onClick={() => setShowCoreForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Core Value
            </button>
          </div>

          {showCoreForm && (
            <ValueForm
              onSubmit={handleCreateCore}
              onCancel={() => setShowCoreForm(false)}
              title="Add Core Value"
            />
          )}

          {editingCore && (
            <ValueForm
              onSubmit={(value, description) => handleUpdateCore(editingCore.id, value, description)}
              onCancel={() => setEditingCore(null)}
              title="Update Core Value"
              initialValue={editingCore.value}
              initialDescription={editingCore.description}
            />
          )}

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-800">
              {coreValues.map((value) => {
                const relatedSupportingValues = supportingValues.filter(sv => 
                  sv.coreValueIds?.includes(value.id)
                );
                
                return (
                  <li key={value.id}>
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-medium text-yellow-400 truncate">
                              {value.value}
                            </p>
                          </div>
                          {value.description && (
                            <p className="mt-2 text-sm text-gray-300">
                              {value.description}
                            </p>
                          )}
                          {relatedSupportingValues.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-400 mb-2">
                                Related Supporting Values ({relatedSupportingValues.length}):
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {relatedSupportingValues.map((sv) => (
                                  <span key={sv.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                                    {sv.value}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex flex-col space-y-1">
                          <button
                            onClick={() => setEditingCore(value)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleArchiveCore(value.id)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                          >
                            Archive
                          </button>
                          <button
                            onClick={() => handleDeleteCore(value.id)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
              {coreValues.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-400">
                  No core values yet. Add one to get started.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Supporting Values Tab */}
      {activeTab === 'supporting' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Supporting Values</h3>
            <button
              onClick={() => setShowSupportingForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Supporting Value
            </button>
          </div>

          {showSupportingForm && (
            <SupportingValueForm
              coreValues={coreValues}
              onSubmit={handleCreateSupporting}
              onCancel={() => setShowSupportingForm(false)}
              title="Add Supporting Value"
            />
          )}

          {editingSupporting && (
            <SupportingValueForm
              coreValues={coreValues}
              onSubmit={(value, description, coreValueIds) => handleUpdateSupporting(editingSupporting.id, value, description, coreValueIds)}
              onCancel={() => setEditingSupporting(null)}
              title="Update Supporting Value"
              initialValue={editingSupporting.value}
              initialDescription={editingSupporting.description}
              initialCoreValueIds={editingSupporting.coreValueIds}
            />
          )}

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-800">
              {supportingValues.map((value) => (
                <li key={value.id}>
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-yellow-400 truncate">
                            {value.value}
                          </p>
                        </div>
                        {value.description && (
                          <p className="mt-2 text-sm text-gray-300">
                            {value.description}
                          </p>
                        )}
                        {value.coreValueNames && value.coreValueNames.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-400 mb-2">
                              Linked to Core Values:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {value.coreValueNames.map((cvName, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                  {cvName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {(!value.coreValueNames || value.coreValueNames.length === 0) && (
                          <p className="mt-2 text-xs text-amber-400">
                            ⚠️ Not linked to any core value
                          </p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col space-y-1">
                        <button
                          onClick={() => setEditingSupporting(value)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleArchiveSupporting(value.id)}
                          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleDeleteSupporting(value.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {supportingValues.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-400">
                  No supporting values yet. Add one to get started.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Quotes</h3>
            <button
              onClick={() => setShowQuoteForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Quote
            </button>
          </div>

          {showQuoteForm && (
            <QuoteForm
              coreValues={coreValues}
              onSubmit={handleCreateQuote}
              onCancel={() => setShowQuoteForm(false)}
              title="Add Quote"
            />
          )}

          {editingQuote && (
            <QuoteForm
              coreValues={coreValues}
              onSubmit={(text, authorName, coreValueIds) => handleUpdateQuote(editingQuote.id, text, authorName, coreValueIds)}
              onCancel={() => setEditingQuote(null)}
              title="Update Quote"
              initialText={editingQuote.text}
              initialAuthorName={editingQuote.author?.name}
              initialCoreValueIds={editingQuote.coreValueIds}
            />
          )}

          {/* Unlinked Quotes Section */}
          {quotes.filter(q => !q.coreValueNames || q.coreValueNames.length === 0).length > 0 && (
            <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700 rounded-lg">
              <h4 className="text-sm font-medium text-amber-300 mb-3">
                ⚠️ Quotes without Core Value links ({quotes.filter(q => !q.coreValueNames || q.coreValueNames.length === 0).length})
              </h4>
              <div className="space-y-2">
                {quotes.filter(q => !q.coreValueNames || q.coreValueNames.length === 0).slice(0, 3).map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded">
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 truncate">
                        &ldquo;{quote.text}&rdquo;
                      </p>
                      {quote.author && (
                        <p className="text-xs text-blue-300 mt-1">
                          — {quote.author.name}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingQuote(quote)}
                      className="ml-3 text-xs bg-yellow-600 hover:bg-yellow-700 text-black px-2 py-1 rounded"
                    >
                      Link Values
                    </button>
                  </div>
                ))}
                {quotes.filter(q => !q.coreValueNames || q.coreValueNames.length === 0).length > 3 && (
                  <p className="text-xs text-amber-400">
                    ... and {quotes.filter(q => !q.coreValueNames || q.coreValueNames.length === 0).length - 3} more unlinked quotes
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-800">
              {quotes.map((quote) => (
                <li key={quote.id}>
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-yellow-400">
                            &ldquo;{quote.text}&rdquo;
                          </p>
                        </div>
                        {quote.author && (
                          <p className="mt-2 text-sm text-blue-300 italic">
                            — {quote.author.name}
                          </p>
                        )}
                        {quote.coreValueNames && quote.coreValueNames.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-400 mb-2">
                              Linked to Core Values:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {quote.coreValueNames.map((cvName, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                                  {cvName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {(!quote.coreValueNames || quote.coreValueNames.length === 0) && (
                          <p className="mt-2 text-xs text-amber-400">
                            ⚠️ Not linked to any core value
                          </p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col space-y-1">
                        <button
                          onClick={() => setEditingQuote(quote)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleArchiveQuote(quote.id)}
                          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {quotes.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-400">
                  No quotes yet. Add one to get started.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Core Value Form (unchanged)
function ValueForm({ 
  onSubmit, 
  onCancel, 
  title,
  initialValue = '',
  initialDescription = ''
}: { 
  onSubmit: (value: string, description?: string) => void;
  onCancel: () => void;
  title: string;
  initialValue?: string;
  initialDescription?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim(), description.trim() || undefined);
      setValue('');
      setDescription('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-4 rounded-lg mb-4">
      <h4 className="text-lg font-medium text-white mb-4">{title}</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Value Name *
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter value name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter description"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-black bg-yellow-600 hover:bg-yellow-700 rounded-md"
          >
            Add {title.includes('Core') ? 'Core' : 'Supporting'} Value
          </button>
        </div>
      </form>
    </div>
  );
}

// Supporting Value Form (with Core Value dropdown)
function SupportingValueForm({ 
  coreValues,
  onSubmit, 
  onCancel, 
  title,
  initialValue = '',
  initialDescription = '',
  initialCoreValueIds = []
}: { 
  coreValues: CoreValue[];
  onSubmit: (value: string, description?: string, coreValueIds?: string[]) => void;
  onCancel: () => void;
  title: string;
  initialValue?: string;
  initialDescription?: string;
  initialCoreValueIds?: string[];
}) {
  const [value, setValue] = useState(initialValue);
  const [description, setDescription] = useState(initialDescription);
  const [selectedCoreValueIds, setSelectedCoreValueIds] = useState<string[]>(initialCoreValueIds);

  const handleCoreValueToggle = (coreValueId: string) => {
    setSelectedCoreValueIds(prev => 
      prev.includes(coreValueId)
        ? prev.filter(id => id !== coreValueId)
        : [...prev, coreValueId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && selectedCoreValueIds.length > 0) {
      onSubmit(value.trim(), description.trim() || undefined, selectedCoreValueIds);
      setValue('');
      setDescription('');
      setSelectedCoreValueIds([]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-4 rounded-lg mb-4">
      <h4 className="text-lg font-medium text-white mb-4">{title}</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Supporting Value Name *
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter supporting value name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Link to Core Values * (select one or more)
          </label>
          <div className="bg-gray-700 border border-gray-600 rounded-md p-3 max-h-48 overflow-y-auto">
            {coreValues.map((cv) => (
              <label key={cv.id} className="flex items-center space-x-3 py-2 hover:bg-gray-600 rounded px-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCoreValueIds.includes(cv.id)}
                  onChange={() => handleCoreValueToggle(cv.id)}
                  className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <span className="text-white">{cv.value}</span>
                {cv.description && (
                  <span className="text-gray-400 text-xs">({cv.description})</span>
                )}
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Supporting values can be linked to multiple core values to show thematic relationships
          </p>
          {selectedCoreValueIds.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-yellow-400 mb-1">
                Selected ({selectedCoreValueIds.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedCoreValueIds.map(id => {
                  const coreValue = coreValues.find(cv => cv.id === id);
                  return (
                    <span key={id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                      {coreValue?.value}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter description"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={selectedCoreValueIds.length === 0}
            className="px-4 py-2 text-sm font-medium text-black bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed rounded-md"
          >
            {title.includes('Update') ? 'Update' : 'Add'} Supporting Value
          </button>
        </div>
      </form>
    </div>
  );
}

// Quote Form (with Author and Core Value linking)
function QuoteForm({ 
  coreValues,
  onSubmit, 
  onCancel, 
  title,
  initialText = '',
  initialAuthorName = '',
  initialCoreValueIds = []
}: { 
  coreValues: CoreValue[];
  onSubmit: (text: string, authorName?: string, coreValueIds?: string[]) => void;
  onCancel: () => void;
  title: string;
  initialText?: string;
  initialAuthorName?: string;
  initialCoreValueIds?: string[];
}) {
  const [text, setText] = useState(initialText);
  const [authorName, setAuthorName] = useState(initialAuthorName);
  const [selectedCoreValueIds, setSelectedCoreValueIds] = useState<string[]>(initialCoreValueIds);

  const handleCoreValueToggle = (coreValueId: string) => {
    setSelectedCoreValueIds(prev => 
      prev.includes(coreValueId)
        ? prev.filter(id => id !== coreValueId)
        : [...prev, coreValueId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim(), authorName.trim() || undefined, selectedCoreValueIds.length > 0 ? selectedCoreValueIds : undefined);
      setText('');
      setAuthorName('');
      setSelectedCoreValueIds([]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-4 rounded-lg mb-4">
      <h4 className="text-lg font-medium text-white mb-4">{title}</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Quote Text *
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter the quote text"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Author (optional)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Enter author name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Link to Core Values (optional)
          </label>
          <div className="bg-gray-700 border border-gray-600 rounded-md p-3 max-h-48 overflow-y-auto">
            {coreValues.map((cv) => (
              <label key={cv.id} className="flex items-center space-x-3 py-2 hover:bg-gray-600 rounded px-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCoreValueIds.includes(cv.id)}
                  onChange={() => handleCoreValueToggle(cv.id)}
                  className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <span className="text-white">{cv.value}</span>
                {cv.description && (
                  <span className="text-gray-400 text-xs">({cv.description})</span>
                )}
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Select core values that align with this quote&apos;s message
          </p>
          {selectedCoreValueIds.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-yellow-400 mb-1">
                Selected ({selectedCoreValueIds.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedCoreValueIds.map(id => {
                  const coreValue = coreValues.find(cv => cv.id === id);
                  return (
                    <span key={id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                      {coreValue?.value}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-black bg-yellow-600 hover:bg-yellow-700 rounded-md"
          >
            {title.includes('Update') ? 'Update' : 'Add'} Quote
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ValuesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ValuesPageContent />
    </Suspense>
  );
}