'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { screenElementsAPI } from '@/lib/api';
import { ArrowLeft, Layers, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';

// Convert icon name to mdi path key (e.g., 'home' -> 'mdiHome')
const toMdiKey = (iconName: string): string => {
  if (!iconName) return '';
  return 'mdi' + iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Get MDI path by icon name
const getMdiPath = (iconName: string): string | null => {
  if (!iconName) return null;
  const key = toMdiKey(iconName);
  return (mdiIcons as any)[key] || null;
};

export default function ScreenElementsLibrary() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [elements, setElements] = useState<any[]>([]);
  const [filteredElements, setFilteredElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Convert to lowercase for string comparison
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredElements(filtered);
  }, [searchQuery, selectedCategory, elements, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-primary" />
      : <ArrowDown className="w-4 h-4 text-primary" />;
  };

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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/master')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Screen Elements</h1>
                  <p className="text-sm text-gray-500">{Array.isArray(elements) ? elements.length : 0} available elements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Elements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {(!Array.isArray(filteredElements) || filteredElements.length === 0) ? (
            <div className="p-12 text-center">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Modules
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    <button
                      onClick={() => handleSort('element_type')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Type
                      <SortIcon field="element_type" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Category
                      <SortIcon field="category" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Properties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    <button
                      onClick={() => handleSort('is_active')}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      Status
                      <SortIcon field="is_active" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredElements.map((element) => (
                  <tr key={element.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {element.icon && getMdiPath(element.icon) ? (
                            <Icon path={getMdiPath(element.icon)!} size={0.9} className="text-primary" />
                          ) : (
                            <Layers className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{element.name}</div>
                          <div className="text-xs text-gray-500">Order: {element.display_order}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{element.element_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {element.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{element.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {element.is_content_field === 1 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            Content
                          </span>
                        )}
                        {element.has_options === 1 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Options
                          </span>
                        )}
                        {element.is_editable_by_app_admin === 1 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            Editable
                          </span>
                        )}
                        {!element.is_content_field && !element.has_options && !element.is_editable_by_app_admin && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        element.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {element.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
