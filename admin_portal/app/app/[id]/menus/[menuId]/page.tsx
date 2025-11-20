'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { menuAPI, appScreensAPI, appsAPI } from '@/lib/api';
import AppLayout from '@/components/layouts/AppLayout';
import IconPicker from '@/components/IconPicker';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MenuItem {
  id: number;
  menu_id: number;
  screen_id: number;
  display_order: number;
  label: string | null;
  icon: string | null;
  is_active: boolean;
  screen_name: string;
  screen_category: string;
}

interface Menu {
  id: number;
  app_id: number;
  name: string;
  menu_type: string;
  description: string | null;
  is_active: boolean;
  items: MenuItem[];
}

interface Screen {
  id: number;
  name: string;
  category: string;
}

interface SortableItemProps {
  item: MenuItem;
  onRemove: (itemId: number) => void;
  onUpdate: (itemId: number, data: Partial<MenuItem>) => void;
}

function SortableItem({ item, onRemove, onUpdate }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Screen Info */}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{item.screen_name}</div>
        <div className="text-sm text-gray-500">{item.screen_category}</div>
      </div>

      {/* Label Override */}
      <div className="w-48">
        <input
          type="text"
          value={item.label || ''}
          onChange={(e) => onUpdate(item.id, { label: e.target.value })}
          placeholder="Custom label"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Icon */}
      <div className="w-48">
        <IconPicker
          value={item.icon || ''}
          onChange={(iconName) => onUpdate(item.id, { icon: iconName })}
          placeholder="Select icon"
        />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appId = parseInt(params.id as string);
  const menuId = parseInt(params.menuId as string);

  const [menu, setMenu] = useState<Menu | null>(null);
  const [allScreens, setAllScreens] = useState<Screen[]>([]);
  const [appName, setAppName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedScreenIds, setSelectedScreenIds] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, [menuId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuResponse, screensResponse, appResponse] = await Promise.all([
        menuAPI.getMenu(menuId),
        appScreensAPI.getAppScreens(appId),
        appsAPI.getById(appId),
      ]);

      setMenu(menuResponse.data);
      setAppName(appResponse.data?.name || 'App');
      setAllScreens(screensResponse.data);
      
      // Pre-select screens that are already in the menu
      const menuScreenIds = menuResponse.data.items.map((item: MenuItem) => item.screen_id);
      setSelectedScreenIds(menuScreenIds);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenu((prevMenu) => {
        if (!prevMenu) return prevMenu;

        const items = prevMenu.items;
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          display_order: index,
        }));

        setHasChanges(true);
        return { ...prevMenu, items: newItems };
      });
    }
  };

  const handleToggleScreen = (screenId: number) => {
    setSelectedScreenIds((prev) =>
      prev.includes(screenId)
        ? prev.filter((id) => id !== screenId)
        : [...prev, screenId]
    );
  };

  const handleSaveScreens = async () => {
    if (!menu) return;

    try {
      const currentScreenIds = menu.items.map((item) => item.screen_id);
      
      // Find screens to add (selected but not in menu)
      const screensToAdd = selectedScreenIds.filter((id) => !currentScreenIds.includes(id));
      
      // Find screens to remove (in menu but not selected)
      const screensToRemove = currentScreenIds.filter((id) => !selectedScreenIds.includes(id));

      // Add new screens
      for (const screenId of screensToAdd) {
        const maxOrder = menu.items.length + screensToAdd.indexOf(screenId);
        await menuAPI.addMenuItem(menuId, {
          screen_id: screenId,
          display_order: maxOrder,
        });
      }

      // Remove unchecked screens
      for (const screenId of screensToRemove) {
        const item = menu.items.find((item) => item.screen_id === screenId);
        if (item) {
          await menuAPI.removeMenuItem(item.id);
        }
      }

      setShowAddModal(false);
      fetchData();
    } catch (error: any) {
      console.error('Error updating screens:', error);
      alert(error.response?.data?.message || 'Failed to update screens');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm('Remove this screen from the menu?')) return;

    try {
      await menuAPI.removeMenuItem(itemId);
      fetchData();
    } catch (error: any) {
      console.error('Error removing item:', error);
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleUpdateItem = (itemId: number, data: Partial<MenuItem>) => {
    setMenu((prevMenu) => {
      if (!prevMenu) return prevMenu;

      const newItems = prevMenu.items.map((item) =>
        item.id === itemId ? { ...item, ...data } : item
      );

      setHasChanges(true);
      return { ...prevMenu, items: newItems };
    });
  };

  const handleSaveChanges = async () => {
    if (!menu) return;

    try {
      // Update all items with new order and properties
      await Promise.all(
        menu.items.map((item) =>
          menuAPI.updateMenuItem(item.id, {
            display_order: item.display_order,
            label: item.label || undefined,
            icon: item.icon || undefined,
          })
        )
      );

      setHasChanges(false);
      alert('Changes saved successfully!');
    } catch (error: any) {
      console.error('Error saving changes:', error);
      alert(error.response?.data?.message || 'Failed to save changes');
    }
  };

  if (loading) {
    return (
      <AppLayout appId={appId.toString()} appName={appName}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading menu...</div>
        </div>
      </AppLayout>
    );
  }

  if (!menu) {
    return (
      <AppLayout appId={appId.toString()} appName={appName}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Menu not found</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout appId={appId.toString()} appName={appName}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/app/${appId}/menus`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menus
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
              <p className="text-gray-600 mt-1">
                {menu.description || 'Manage screens in this menu'}
              </p>
            </div>

            <div className="flex gap-3">
              {hasChanges && (
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Manage Screens
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        {menu.items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No screens in this menu</h3>
            <p className="text-gray-600 mb-4">Add screens to build your menu navigation</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Screens
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Drag and drop to reorder • {menu.items.length} screen{menu.items.length !== 1 ? 's' : ''}
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={menu.items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {menu.items.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdate={handleUpdateItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Add/Manage Screens Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
              <h2 className="text-xl font-bold mb-2">Manage Menu Screens</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select which screens should appear in this menu. Check/uncheck to add or remove.
              </p>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {allScreens.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No screens available</p>
                ) : (
                  allScreens.map((screen: Screen) => (
                    <label
                      key={screen.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedScreenIds.includes(screen.id)}
                        onChange={() => handleToggleScreen(screen.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{screen.name}</div>
                        <div className="text-sm text-gray-500">{screen.category}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    // Reset to current menu items
                    if (menu) {
                      const menuScreenIds = menu.items.map((item) => item.screen_id);
                      setSelectedScreenIds(menuScreenIds);
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveScreens}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
