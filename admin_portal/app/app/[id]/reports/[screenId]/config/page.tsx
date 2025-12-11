'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { reportsAPI, appsAPI, rolesAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import { ArrowLeft, Save, Eye, EyeOff, Trash2, Edit, Download, GripVertical, Calendar, User, FileText } from 'lucide-react';

interface ScreenElement {
  id: number;
  field_key: string;
  label: string;
  element_name: string;
  element_type: string;
  category: string;
}

interface ReportConfig {
  id?: number;
  report_name: string;
  description: string;
  display_columns: string[];
  filter_fields: string[];
  action_buttons: string[];
  view_fields: string[];
  edit_fields: string[];
  default_sort_field: string;
  default_sort_order: 'asc' | 'desc';
  rows_per_page: number;
  allowed_roles: number[];  // Roles that can VIEW reports
  edit_roles: number[];     // Roles that can EDIT/configure reports
  is_active: boolean;
  show_date_column: boolean;
  show_user_column: boolean;
  column_order: string[];   // Order of all columns (system + field)
}

interface ColumnItem {
  key: string;
  label: string;
  type: 'system' | 'field';
  subLabel?: string;
  isVisible: boolean;
}

interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
}

const ACTION_BUTTON_OPTIONS = [
  { value: 'view', label: 'View', icon: Eye },
  { value: 'edit', label: 'Edit', icon: Edit },
  { value: 'delete', label: 'Delete', icon: Trash2 },
  { value: 'export', label: 'Export', icon: Download },
];

export default function ReportConfigPage() {
  const router = useRouter();
  const params = useParams();
  const appId = parseInt(params.id as string);
  const screenId = parseInt(params.screenId as string);
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appName, setAppName] = useState('');
  const [screenName, setScreenName] = useState('');
  const [elements, setElements] = useState<ScreenElement[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [config, setConfig] = useState<ReportConfig>({
    report_name: '',
    description: '',
    display_columns: [],
    filter_fields: [],
    action_buttons: ['view'],
    view_fields: [],
    edit_fields: [],
    default_sort_field: '',
    default_sort_order: 'desc',
    rows_per_page: 25,
    allowed_roles: [],
    edit_roles: [],
    is_active: true,
    show_date_column: true,
    show_user_column: true,
    column_order: ['_date', '_user'],
  });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Master Admin always has access, others need to be checked after fetching config
    if (user?.role_level === 1) {
      fetchData();
    } else if (user) {
      // Check if user has edit access
      checkEditAccess();
    }
  }, [user, isAuthenticated, appId, screenId]);

  const checkEditAccess = async () => {
    try {
      const response = await reportsAPI.getReportConfig(appId, screenId);
      const editRoles = response.data?.config?.edit_roles || [];
      
      if (editRoles.includes(user?.role_id)) {
        fetchData();
      } else {
        router.push(`/app/${appId}/reports`);
      }
    } catch (err) {
      console.error('Error checking edit access:', err);
      router.push(`/app/${appId}/reports`);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setAppName(appResponse.data?.name || 'App');

      // Fetch report config and screen elements
      const configResponse = await reportsAPI.getReportConfig(appId, screenId);
      const { screen, elements: screenElements, config: existingConfig } = configResponse.data;
      
      setScreenName(screen.name);
      setElements(screenElements || []);

      // If config exists, populate form
      if (existingConfig) {
        const allFieldKeys = screenElements.map((el: ScreenElement) => el.field_key);
        // Build default column order if not present
        const defaultOrder = ['_date', '_user', ...allFieldKeys];
        setConfig({
          report_name: existingConfig.report_name || screen.name,
          description: existingConfig.description || '',
          display_columns: existingConfig.display_columns || [],
          filter_fields: existingConfig.filter_fields || [],
          action_buttons: existingConfig.action_buttons || ['view'],
          view_fields: existingConfig.view_fields || [],
          edit_fields: existingConfig.edit_fields || [],
          default_sort_field: existingConfig.default_sort_field || '',
          default_sort_order: existingConfig.default_sort_order || 'desc',
          rows_per_page: existingConfig.rows_per_page || 25,
          allowed_roles: existingConfig.allowed_roles || [],
          edit_roles: existingConfig.edit_roles || [],
          is_active: existingConfig.is_active !== false,
          show_date_column: existingConfig.show_date_column !== false,
          show_user_column: existingConfig.show_user_column !== false,
          column_order: existingConfig.column_order || defaultOrder,
        });
      } else {
        // Default: all fields visible in all views
        const allFieldKeys = screenElements.map((el: ScreenElement) => el.field_key);
        setConfig(prev => ({
          ...prev,
          report_name: screen.name,
          display_columns: allFieldKeys,
          view_fields: allFieldKeys,
          edit_fields: allFieldKeys,
          column_order: ['_date', '_user', ...allFieldKeys],
        }));
      }

      // Fetch administrator roles (Admin, Editor, etc.) - exclude Master Admin (level 1)
      const rolesResponse = await rolesAPI.getAdminRoles();
      const adminRoles = (rolesResponse.data || []).filter((role: Role) => role.level !== 1);
      setRoles(adminRoles);
    } catch (err: any) {
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await reportsAPI.saveReportConfig(appId, screenId, config);
      router.push(`/app/${appId}/reports`);
    } catch (err: any) {
      console.error('Error saving config:', err);
      alert(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const toggleColumn = (fieldKey: string) => {
    setConfig(prev => ({
      ...prev,
      display_columns: prev.display_columns.includes(fieldKey)
        ? prev.display_columns.filter(k => k !== fieldKey)
        : [...prev.display_columns, fieldKey],
    }));
  };

  const toggleFilter = (fieldKey: string) => {
    setConfig(prev => ({
      ...prev,
      filter_fields: prev.filter_fields.includes(fieldKey)
        ? prev.filter_fields.filter(k => k !== fieldKey)
        : [...prev.filter_fields, fieldKey],
    }));
  };

  const toggleActionButton = (action: string) => {
    setConfig(prev => ({
      ...prev,
      action_buttons: prev.action_buttons.includes(action)
        ? prev.action_buttons.filter(a => a !== action)
        : [...prev.action_buttons, action],
    }));
  };

  const toggleViewRole = (roleId: number) => {
    setConfig(prev => {
      const hasView = prev.allowed_roles.includes(roleId);
      const hasEdit = prev.edit_roles.includes(roleId);
      
      if (hasView) {
        // Removing view also removes edit
        return {
          ...prev,
          allowed_roles: prev.allowed_roles.filter(id => id !== roleId),
          edit_roles: prev.edit_roles.filter(id => id !== roleId),
        };
      } else {
        // Adding view
        return {
          ...prev,
          allowed_roles: [...prev.allowed_roles, roleId],
        };
      }
    });
  };

  const toggleEditRole = (roleId: number) => {
    setConfig(prev => {
      const hasEdit = prev.edit_roles.includes(roleId);
      
      if (hasEdit) {
        // Removing edit only
        return {
          ...prev,
          edit_roles: prev.edit_roles.filter(id => id !== roleId),
        };
      } else {
        // Adding edit also adds view
        return {
          ...prev,
          allowed_roles: prev.allowed_roles.includes(roleId) 
            ? prev.allowed_roles 
            : [...prev.allowed_roles, roleId],
          edit_roles: [...prev.edit_roles, roleId],
        };
      }
    });
  };

  const toggleViewField = (fieldKey: string) => {
    setConfig(prev => ({
      ...prev,
      view_fields: prev.view_fields.includes(fieldKey)
        ? prev.view_fields.filter(k => k !== fieldKey)
        : [...prev.view_fields, fieldKey],
    }));
  };

  const toggleEditField = (fieldKey: string) => {
    setConfig(prev => ({
      ...prev,
      edit_fields: prev.edit_fields.includes(fieldKey)
        ? prev.edit_fields.filter(k => k !== fieldKey)
        : [...prev.edit_fields, fieldKey],
    }));
  };

  if (loading) {
    return (
      <AppLayout appId={params.id as string} appName={appName || 'Loading...'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading configuration...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={params.id as string} appName={appName}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/app/${appId}/reports`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configure Report</h1>
              <p className="text-gray-600">{screenName}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Report Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Report Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Name
                  </label>
                  <input
                    type="text"
                    value={config.report_name}
                    onChange={(e) => setConfig(prev => ({ ...prev, report_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rows Per Page
                  </label>
                  <select
                    value={config.rows_per_page}
                    onChange={(e) => setConfig(prev => ({ ...prev, rows_per_page: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Sort Order
                  </label>
                  <select
                    value={config.default_sort_order}
                    onChange={(e) => setConfig(prev => ({ ...prev, default_sort_order: e.target.value as 'asc' | 'desc' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={config.is_active}
                    onChange={(e) => setConfig(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Report Active
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Action Buttons</h2>
              <p className="text-sm text-gray-500 mb-4">
                Select which action buttons to show in the Actions column
              </p>
              
              <div className="space-y-2">
                {ACTION_BUTTON_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={config.action_buttons.includes(option.value)}
                      onChange={() => toggleActionButton(option.value)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <option.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Role Access */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Role Access</h2>
              <p className="text-sm text-gray-500 mb-4">
                Master Admin always has full access. Configure access for other administrator roles below.
              </p>
              
              {roles.length === 0 ? (
                <p className="text-sm text-gray-400">No additional roles defined</p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                    <div className="px-4 py-3 text-sm font-medium text-gray-700">
                      Administrator Role
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-gray-700 text-center">
                      View
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-gray-700 text-center">
                      Configure
                    </div>
                  </div>
                  {/* Rows */}
                  {roles.map((role, index) => (
                    <div 
                      key={role.id} 
                      className={`grid grid-cols-3 ${index < roles.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <div className="px-4 py-3">
                        <span className="text-sm font-medium">{role.name}</span>
                        {role.description && (
                          <p className="text-xs text-gray-500">{role.description}</p>
                        )}
                      </div>
                      <div className="px-4 py-3 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={config.allowed_roles.includes(role.id)}
                          onChange={() => toggleViewRole(role.id)}
                          className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        />
                      </div>
                      <div className="px-4 py-3 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={config.edit_roles.includes(role.id)}
                          onChange={() => toggleEditRole(role.id)}
                          className="w-4 h-4 text-green-600 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">
                View: Can see reports and data. Configure: Can configure reports (automatically includes View access).
              </p>
            </div>
          </div>

          {/* Right Column - Columns & Filters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Display Columns */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Display Columns</h2>
              <p className="text-sm text-gray-500 mb-4">
                Drag to reorder columns. Toggle visibility with the eye icon.
              </p>
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> System</span>
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Field</span>
              </div>
              
              <div className="space-y-2">
                {config.column_order.map((columnKey, index) => {
                  const isSystem = columnKey.startsWith('_');
                  const isDate = columnKey === '_date';
                  const isUser = columnKey === '_user';
                  const element = elements.find(el => el.field_key === columnKey);
                  
                  // Skip if it's a field column that doesn't exist in elements
                  if (!isSystem && !element) return null;
                  
                  // Skip non-input elements (they don't contain user data)
                  if (element && ['paragraph', 'button', 'heading'].includes(element.element_type?.toLowerCase())) return null;
                  
                  const isVisible = isDate 
                    ? config.show_date_column 
                    : isUser 
                      ? config.show_user_column 
                      : config.display_columns.includes(columnKey);
                  
                  const label = isDate ? 'Date' : isUser ? 'User' : (element?.label || columnKey);
                  const subLabel = isDate ? 'Submission date' : isUser ? 'Submitted by' : `${element?.element_type} • ${columnKey}`;
                  
                  return (
                    <div
                      key={columnKey}
                      draggable
                      onDragStart={() => setDraggedItem(columnKey)}
                      onDragEnd={() => setDraggedItem(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedItem && draggedItem !== columnKey) {
                          const newOrder = [...config.column_order];
                          const dragIndex = newOrder.indexOf(draggedItem);
                          const dropIndex = newOrder.indexOf(columnKey);
                          newOrder.splice(dragIndex, 1);
                          newOrder.splice(dropIndex, 0, draggedItem);
                          setConfig(prev => ({ ...prev, column_order: newOrder }));
                        }
                      }}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-move transition-all ${
                        draggedItem === columnKey 
                          ? 'border-blue-500 bg-blue-50 opacity-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-shrink-0">
                        {isSystem ? (
                          <Calendar className="w-4 h-4 text-purple-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block truncate">{label}</span>
                        <span className="text-xs text-gray-500">{subLabel}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDate) {
                            setConfig(prev => ({ ...prev, show_date_column: !prev.show_date_column }));
                          } else if (isUser) {
                            setConfig(prev => ({ ...prev, show_user_column: !prev.show_user_column }));
                          } else {
                            toggleColumn(columnKey);
                          }
                        }}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        {isVisible ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-300" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter Fields */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Filter Fields</h2>
              <p className="text-sm text-gray-500 mb-4">
                Select which fields can be used as search/filter criteria
              </p>
              
              {elements.filter(el => !['paragraph', 'button', 'heading'].includes(el.element_type?.toLowerCase())).length === 0 ? (
                <p className="text-sm text-gray-400">No fields available for this screen</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {elements
                    .filter(el => !['paragraph', 'button', 'heading'].includes(el.element_type?.toLowerCase()))
                    .map((element) => (
                    <label
                      key={element.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={config.filter_fields.includes(element.field_key)}
                        onChange={() => toggleFilter(element.field_key)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block truncate">
                          {element.label || element.field_key}
                        </span>
                        <span className="text-xs text-gray-500">
                          {element.element_type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* View Modal Fields */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">View Modal Fields</h2>
              <p className="text-sm text-gray-500 mb-4">
                Select which fields to display when viewing a submission
              </p>
              
              {elements.filter(el => !['paragraph', 'button', 'heading'].includes(el.element_type?.toLowerCase())).length === 0 ? (
                <p className="text-sm text-gray-400">No fields available for this screen</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {elements
                    .filter(el => !['paragraph', 'button', 'heading'].includes(el.element_type?.toLowerCase()))
                    .map((element) => (
                    <label
                      key={element.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={config.view_fields.includes(element.field_key)}
                        onChange={() => toggleViewField(element.field_key)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block truncate">
                          {element.label || element.field_key}
                        </span>
                        <span className="text-xs text-gray-500">
                          {element.element_type}
                        </span>
                      </div>
                      {config.view_fields.includes(element.field_key) ? (
                        <Eye className="w-4 h-4 text-blue-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-300" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Modal Fields */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Edit Modal Fields</h2>
              <p className="text-sm text-gray-500 mb-4">
                Select which fields can be edited when editing a submission
              </p>
              
              {elements.filter(el => !['paragraph', 'button', 'heading'].includes(el.element_type?.toLowerCase())).length === 0 ? (
                <p className="text-sm text-gray-400">No fields available for this screen</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {elements
                    .filter(el => !['paragraph', 'button', 'heading'].includes(el.element_type?.toLowerCase()))
                    .map((element) => (
                    <label
                      key={element.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={config.edit_fields.includes(element.field_key)}
                        onChange={() => toggleEditField(element.field_key)}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block truncate">
                          {element.label || element.field_key}
                        </span>
                        <span className="text-xs text-gray-500">
                          {element.element_type}
                        </span>
                      </div>
                      {config.edit_fields.includes(element.field_key) ? (
                        <Edit className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-300" />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
