'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { formsAPI } from '@/lib/api';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function FormsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role_level !== 1) {
      router.push('/login');
      return;
    }

    fetchForms();
  }, [isAuthenticated, user, router]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await formsAPI.getAll();
      if (response.success) {
        setForms(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      const response = await formsAPI.delete(id);
      if (response.success) {
        alert('Form deleted successfully!');
        fetchForms();
      } else {
        alert(response.message || 'Failed to delete form');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete form');
    }
  };

  const getFormTypeColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'edit': return 'bg-blue-100 text-blue-800';
      case 'search': return 'bg-purple-100 text-purple-800';
      case 'filter': return 'bg-orange-100 text-orange-800';
      case 'multi_step': return 'bg-pink-100 text-pink-800';
      case 'wizard': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
                  <p className="text-sm text-gray-500">Manage reusable form templates</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push('/master/forms/new')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Form
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{forms.length}</p>
              </div>
              <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Forms</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {forms.filter(f => f.is_active).length}
                </p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fields</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {forms.reduce((sum, f) => sum + (parseInt(f.element_count) || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">App Assignments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {forms.reduce((sum, f) => sum + (parseInt(f.app_count) || 0), 0)}
                </p>
              </div>
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Forms</h2>
          </div>

          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Yet</h3>
              <p className="text-gray-500 mb-4">Create your first form to get started</p>
              <Button onClick={() => router.push('/master/forms/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fields
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Apps
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{form.name}</div>
                            <div className="text-xs text-gray-500">{form.form_key}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFormTypeColor(form.form_type)}`}>
                          {form.form_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{form.category || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{form.element_count || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{form.app_count || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          form.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {form.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(form.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/master/forms/${form.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit form"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(form.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete form"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
