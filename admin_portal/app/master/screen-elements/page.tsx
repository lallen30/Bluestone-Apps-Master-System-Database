'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { screenElementsAPI } from '@/lib/api';
import { ArrowLeft, Layers, Search } from 'lucide-react';

export default function ScreenElementsLibrary() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [elements, setElements] = useState<any[]>([]);
  const [filteredElements, setFilteredElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (token && !user) {
      return;
    }

    if (user?.role_level !== 1) {
      router.push('/dashboard');
      return;
    }

    fetchElements();
  }, [isAuthenticated, user, router]);

  const fetchElements = async () => {
    try {
      console.log('Fetching screen elements...');
      const response = await screenElementsAPI.getAll();
      console.log('Screen elements response:', response);
      console.log('Screen elements data:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      // Handle both array and single object responses
      const elementsData = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
      console.log('Processed elements:', elementsData);
      
      setElements(elementsData);
      setFilteredElements(elementsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching elements:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = elements;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(el => el.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(el =>
        el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.element_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredElements(filtered);
  }, [searchQuery, selectedCategory, elements]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading elements...</p>
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(Array.isArray(elements) ? elements.map(el => el.category) : []))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/master')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Screen Elements Library</h1>
                <p className="text-sm text-gray-500">{Array.isArray(elements) ? elements.length : 0} available elements</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredElements) && filteredElements.map((element) => (
            <div
              key={element.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{element.name}</h3>
                    <p className="text-xs text-gray-500">{element.element_type}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{element.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {element.category}
                </span>
                {element.is_content_field && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Content
                  </span>
                )}
                {element.has_options && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Has Options
                  </span>
                )}
                {element.is_editable_by_app_admin && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    Editable
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Order: {element.display_order}</span>
                  <span className={`px-2 py-1 rounded-full ${element.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {element.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!Array.isArray(filteredElements) || filteredElements.length === 0) && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No elements found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}
