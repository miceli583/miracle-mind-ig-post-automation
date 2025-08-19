'use client';

import { useEffect, useState } from 'react';
import type { CoreValue, SupportingValue, CoreValueSupportingValue } from '@/types/database-relational';

interface ExtendedSupportingValue extends SupportingValue {
  coreValueIds?: string[];
  coreValueNames?: string[];
}

export default function ValuesPage() {
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [supportingValues, setSupportingValues] = useState<ExtendedSupportingValue[]>([]);
  const [relationships, setRelationships] = useState<CoreValueSupportingValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'core' | 'supporting'>('core');
  
  // Form states
  const [showCoreForm, setShowCoreForm] = useState(false);
  const [showSupportingForm, setShowSupportingForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch the complete database structure with relationships
      const response = await fetch('/api/admin/debug/db-structure');
      if (response.ok) {
        const data = await response.json();
        
        // Set core values and supporting values
        if (data.coreValues) setCoreValues(data.coreValues);
        if (data.supportingValues) setSupportingValues(data.supportingValues);
        if (data.coreValueSupportingValues) setRelationships(data.coreValueSupportingValues);
        
        // Enhance supporting values with core value relationships
        if (data.supportingValues && data.coreValueSupportingValues && data.coreValues) {
          const enhancedSupportingValues = data.supportingValues.map((sv: SupportingValue) => {
            const relatedCoreValueIds = data.coreValueSupportingValues
              .filter((rel: CoreValueSupportingValue) => rel.supportingValueId === sv.id)
              .map((rel: CoreValueSupportingValue) => rel.coreValueId);
            
            const relatedCoreValueNames = relatedCoreValueIds
              .map((id: string) => data.coreValues.find((cv: CoreValue) => cv.id === id)?.value)
              .filter(Boolean);
            
            return {
              ...sv,
              coreValueIds: relatedCoreValueIds,
              coreValueNames: relatedCoreValueNames
            };
          });
          setSupportingValues(enhancedSupportingValues);
        }
      }
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

  const handleCreateSupporting = async (value: string, description?: string, coreValueId?: string) => {
    try {
      const response = await fetch('/api/admin/supporting-values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, description, coreValueId, isActive: true })
      });
      if (response.ok) {
        setShowSupportingForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create supporting value:', error);
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
            onClick={() => setActiveTab('core')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'core'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Core Values ({coreValues.length})
          </button>
          <button
            onClick={() => setActiveTab('supporting')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'supporting'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Supporting Values ({supportingValues.length})
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
                        <div className="ml-2 flex-shrink-0 flex">
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
                      <div className="ml-2 flex-shrink-0 flex">
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
    </div>
  );
}

// Core Value Form (unchanged)
function ValueForm({ 
  onSubmit, 
  onCancel, 
  title 
}: { 
  onSubmit: (value: string, description?: string) => void;
  onCancel: () => void;
  title: string;
}) {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');

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
  title 
}: { 
  coreValues: CoreValue[];
  onSubmit: (value: string, description?: string, coreValueId?: string) => void;
  onCancel: () => void;
  title: string;
}) {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCoreValueId, setSelectedCoreValueId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && selectedCoreValueId) {
      onSubmit(value.trim(), description.trim() || undefined, selectedCoreValueId);
      setValue('');
      setDescription('');
      setSelectedCoreValueId('');
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
            Link to Core Value *
          </label>
          <select
            value={selectedCoreValueId}
            onChange={(e) => setSelectedCoreValueId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            required
          >
            <option value="">Select a core value...</option>
            {coreValues.map((cv) => (
              <option key={cv.id} value={cv.id}>
                {cv.value}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400">
            Supporting values must be linked to a core value to show thematic relationships
          </p>
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
            disabled={!selectedCoreValueId}
            className="px-4 py-2 text-sm font-medium text-black bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed rounded-md"
          >
            Add Supporting Value
          </button>
        </div>
      </form>
    </div>
  );
}