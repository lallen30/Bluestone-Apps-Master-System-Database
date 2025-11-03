'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { appScreensAPI, screenElementsAPI } from '@/lib/api';
import { ArrowLeft, Save, Eye, Plus, X, GripVertical, Settings, ChevronDown, User, Home, Settings as SettingsIcon, ShoppingCart, MessageSquare, Bell, Calendar, FileText, Image, MapPin, Search, LayoutDashboard, Heart, Star, Trash2, Edit, Mail, Phone, Lock, LogOut, Menu, Filter, Download, Upload, Share2, Bookmark, Flag, Tag, Zap, TrendingUp, BarChart, PieChart, Activity, Briefcase, CreditCard, DollarSign, Gift, Package, Truck, Clock, CheckCircle, XCircle, AlertCircle, Info, HelpCircle, Shield, Key, Users, UserPlus, UserCheck, Globe, Wifi, Smartphone, Tablet, Monitor, Laptop, Printer, Camera, Video, Music, Headphones, Mic, Volume2, Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Building, Building2, Store, Warehouse } from 'lucide-react';

interface ScreenElement {
  id: number;
  name: string;
  element_type: string;
  category: string;
  icon: string;
  has_options: boolean;
  is_content_field: boolean;
  is_input_field: boolean;
}

interface ElementInstance {
  temp_id: string;
  element_id: number;
  element: ScreenElement;
  field_key: string;
  label: string;
  placeholder: string;
  default_value: string;
  is_required: boolean;
  is_readonly: boolean;
  display_order: number;
  config: any;
  validation_rules: any;
}

export default function NewScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Screen details
  const [screenName, setScreenName] = useState('');
  const [screenKey, setScreenKey] = useState('');
  const [isScreenKeyManuallyEdited, setIsScreenKeyManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Monitor');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [category, setCategory] = useState('');
  
  // Elements
  const [availableElements, setAvailableElements] = useState<ScreenElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<ElementInstance[]>([]);
  const [showElementLibrary, setShowElementLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Element editing
  const [editingElement, setEditingElement] = useState<ElementInstance | null>(null);

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
      const response = await screenElementsAPI.getAll();
      const elementsData = Array.isArray(response.data) ? response.data : [];
      setAvailableElements(elementsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching elements:', error);
      setLoading(false);
    }
  };

  const generateScreenKey = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  const handleNameChange = (name: string) => {
    setScreenName(name);
    // Auto-generate screen key unless user has manually edited it
    if (!isScreenKeyManuallyEdited) {
      setScreenKey(generateScreenKey(name));
    }
  };

  const handleScreenKeyChange = (key: string) => {
    setScreenKey(key);
    setIsScreenKeyManuallyEdited(true);
  };

  const addElement = (element: ScreenElement) => {
    const newInstance: ElementInstance = {
      temp_id: `temp_${Date.now()}_${Math.random()}`,
      element_id: element.id,
      element: element,
      field_key: generateScreenKey(element.name),
      label: element.name,
      placeholder: '',
      default_value: '',
      is_required: false,
      is_readonly: false,
      display_order: selectedElements.length,
      config: {},
      validation_rules: {}
    };
    
    setSelectedElements([...selectedElements, newInstance]);
    setShowElementLibrary(false);
  };

  const removeElement = (tempId: string) => {
    setSelectedElements(selectedElements.filter(el => el.temp_id !== tempId));
  };

  const moveElement = (tempId: string, direction: 'up' | 'down') => {
    const index = selectedElements.findIndex(el => el.temp_id === tempId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const newElements = [...selectedElements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      newElements.forEach((el, i) => el.display_order = i);
      setSelectedElements(newElements);
    } else if (direction === 'down' && index < selectedElements.length - 1) {
      const newElements = [...selectedElements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      newElements.forEach((el, i) => el.display_order = i);
      setSelectedElements(newElements);
    }
  };

  const updateElement = (tempId: string, updates: Partial<ElementInstance>) => {
    setSelectedElements(prev => prev.map(el => 
      el.temp_id === tempId ? { ...el, ...updates } : el
    ));
    // Also update editingElement if it's the one being edited
    setEditingElement(prev => {
      if (prev && prev.temp_id === tempId) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  };

  const handleSave = async () => {
    if (!screenName || !screenKey) {
      alert('Please enter screen name and key');
      return;
    }

    if (selectedElements.length === 0) {
      alert('Please add at least one element to the screen');
      return;
    }

    setSaving(true);
    try {
      // Create screen
      const screenResponse = await appScreensAPI.create({
        name: screenName,
        screen_key: screenKey,
        description,
        icon,
        category
      });

      const screenId = screenResponse.data.id;

      // Add elements to screen
      for (const element of selectedElements) {
        await appScreensAPI.addElement({
          screen_id: screenId,
          element_id: element.element_id,
          field_key: element.field_key,
          label: element.label,
          placeholder: element.placeholder,
          default_value: element.default_value,
          is_required: element.is_required,
          is_readonly: element.is_readonly,
          display_order: element.display_order,
          config: JSON.stringify(element.config),
          validation_rules: JSON.stringify(element.validation_rules)
        });
      }

      alert('Screen created successfully!');
      router.push('/master/screens');
    } catch (error: any) {
      console.error('Error creating screen:', error);
      alert(error.response?.data?.message || 'Error creating screen');
      setSaving(false);
    }
  };

  const filteredElements = availableElements.filter(el => {
    const matchesCategory = selectedCategory === 'All' || el.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.element_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...Array.from(new Set(availableElements.map(el => el.category)))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/master/screens')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Screen</h1>
                <p className="text-sm text-gray-500">Design your screen layout</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Preview coming soon!')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Screen'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Screen Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Screen Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screen Name *
                  </label>
                  <input
                    type="text"
                    value={screenName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., User Profile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screen Key *
                  </label>
                  <input
                    type="text"
                    value={screenKey}
                    onChange={(e) => handleScreenKeyChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., user_profile"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from screen name (editable)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of this screen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Profile, Settings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between bg-white hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {icon === 'User' && <User className="w-4 h-4" />}
                        {icon === 'Home' && <Home className="w-4 h-4" />}
                        {icon === 'Settings' && <SettingsIcon className="w-4 h-4" />}
                        {icon === 'ShoppingCart' && <ShoppingCart className="w-4 h-4" />}
                        {icon === 'MessageSquare' && <MessageSquare className="w-4 h-4" />}
                        {icon === 'Bell' && <Bell className="w-4 h-4" />}
                        {icon === 'Calendar' && <Calendar className="w-4 h-4" />}
                        {icon === 'FileText' && <FileText className="w-4 h-4" />}
                        {icon === 'Image' && <Image className="w-4 h-4" />}
                        {icon === 'MapPin' && <MapPin className="w-4 h-4" />}
                        {icon === 'Search' && <Search className="w-4 h-4" />}
                        {icon === 'LayoutDashboard' && <LayoutDashboard className="w-4 h-4" />}
                        {icon === 'Heart' && <Heart className="w-4 h-4" />}
                        {icon === 'Star' && <Star className="w-4 h-4" />}
                        {icon === 'Mail' && <Mail className="w-4 h-4" />}
                        {icon === 'Phone' && <Phone className="w-4 h-4" />}
                        {icon === 'Lock' && <Lock className="w-4 h-4" />}
                        {icon === 'LogOut' && <LogOut className="w-4 h-4" />}
                        {icon === 'Menu' && <Menu className="w-4 h-4" />}
                        {icon === 'Filter' && <Filter className="w-4 h-4" />}
                        {icon === 'Download' && <Download className="w-4 h-4" />}
                        {icon === 'Upload' && <Upload className="w-4 h-4" />}
                        {icon === 'Share2' && <Share2 className="w-4 h-4" />}
                        {icon === 'Bookmark' && <Bookmark className="w-4 h-4" />}
                        {icon === 'Flag' && <Flag className="w-4 h-4" />}
                        {icon === 'Tag' && <Tag className="w-4 h-4" />}
                        {icon === 'Zap' && <Zap className="w-4 h-4" />}
                        {icon === 'TrendingUp' && <TrendingUp className="w-4 h-4" />}
                        {icon === 'BarChart' && <BarChart className="w-4 h-4" />}
                        {icon === 'PieChart' && <PieChart className="w-4 h-4" />}
                        {icon === 'Activity' && <Activity className="w-4 h-4" />}
                        {icon === 'Briefcase' && <Briefcase className="w-4 h-4" />}
                        {icon === 'CreditCard' && <CreditCard className="w-4 h-4" />}
                        {icon === 'DollarSign' && <DollarSign className="w-4 h-4" />}
                        {icon === 'Gift' && <Gift className="w-4 h-4" />}
                        {icon === 'Package' && <Package className="w-4 h-4" />}
                        {icon === 'Truck' && <Truck className="w-4 h-4" />}
                        {icon === 'Clock' && <Clock className="w-4 h-4" />}
                        {icon === 'CheckCircle' && <CheckCircle className="w-4 h-4" />}
                        {icon === 'XCircle' && <XCircle className="w-4 h-4" />}
                        {icon === 'AlertCircle' && <AlertCircle className="w-4 h-4" />}
                        {icon === 'Info' && <Info className="w-4 h-4" />}
                        {icon === 'HelpCircle' && <HelpCircle className="w-4 h-4" />}
                        {icon === 'Shield' && <Shield className="w-4 h-4" />}
                        {icon === 'Key' && <Key className="w-4 h-4" />}
                        {icon === 'Users' && <Users className="w-4 h-4" />}
                        {icon === 'UserPlus' && <UserPlus className="w-4 h-4" />}
                        {icon === 'UserCheck' && <UserCheck className="w-4 h-4" />}
                        {icon === 'Globe' && <Globe className="w-4 h-4" />}
                        {icon === 'Wifi' && <Wifi className="w-4 h-4" />}
                        {icon === 'Smartphone' && <Smartphone className="w-4 h-4" />}
                        {icon === 'Tablet' && <Tablet className="w-4 h-4" />}
                        {icon === 'Monitor' && <Monitor className="w-4 h-4" />}
                        {icon === 'Laptop' && <Laptop className="w-4 h-4" />}
                        {icon === 'Camera' && <Camera className="w-4 h-4" />}
                        {icon === 'Video' && <Video className="w-4 h-4" />}
                        {icon === 'Music' && <Music className="w-4 h-4" />}
                        {icon === 'Headphones' && <Headphones className="w-4 h-4" />}
                        {icon === 'Mic' && <Mic className="w-4 h-4" />}
                        {icon === 'Volume2' && <Volume2 className="w-4 h-4" />}
                        {icon === 'Building' && <Building className="w-4 h-4" />}
                        {icon === 'Building2' && <Building2 className="w-4 h-4" />}
                        {icon === 'Store' && <Store className="w-4 h-4" />}
                        {icon === 'Warehouse' && <Warehouse className="w-4 h-4" />}
                        <span>{icon}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {showIconPicker && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {[
                          { name: 'User', icon: User },
                          { name: 'Home', icon: Home },
                          { name: 'Settings', icon: SettingsIcon },
                          { name: 'ShoppingCart', icon: ShoppingCart },
                          { name: 'MessageSquare', icon: MessageSquare },
                          { name: 'Bell', icon: Bell },
                          { name: 'Calendar', icon: Calendar },
                          { name: 'FileText', icon: FileText },
                          { name: 'Image', icon: Image },
                          { name: 'MapPin', icon: MapPin },
                          { name: 'Search', icon: Search },
                          { name: 'LayoutDashboard', icon: LayoutDashboard },
                          { name: 'Heart', icon: Heart },
                          { name: 'Star', icon: Star },
                          { name: 'Mail', icon: Mail },
                          { name: 'Phone', icon: Phone },
                          { name: 'Lock', icon: Lock },
                          { name: 'LogOut', icon: LogOut },
                          { name: 'Menu', icon: Menu },
                          { name: 'Filter', icon: Filter },
                          { name: 'Download', icon: Download },
                          { name: 'Upload', icon: Upload },
                          { name: 'Share2', icon: Share2 },
                          { name: 'Bookmark', icon: Bookmark },
                          { name: 'Flag', icon: Flag },
                          { name: 'Tag', icon: Tag },
                          { name: 'Zap', icon: Zap },
                          { name: 'TrendingUp', icon: TrendingUp },
                          { name: 'BarChart', icon: BarChart },
                          { name: 'PieChart', icon: PieChart },
                          { name: 'Activity', icon: Activity },
                          { name: 'Briefcase', icon: Briefcase },
                          { name: 'CreditCard', icon: CreditCard },
                          { name: 'DollarSign', icon: DollarSign },
                          { name: 'Gift', icon: Gift },
                          { name: 'Package', icon: Package },
                          { name: 'Truck', icon: Truck },
                          { name: 'Clock', icon: Clock },
                          { name: 'CheckCircle', icon: CheckCircle },
                          { name: 'XCircle', icon: XCircle },
                          { name: 'AlertCircle', icon: AlertCircle },
                          { name: 'Info', icon: Info },
                          { name: 'HelpCircle', icon: HelpCircle },
                          { name: 'Shield', icon: Shield },
                          { name: 'Key', icon: Key },
                          { name: 'Users', icon: Users },
                          { name: 'UserPlus', icon: UserPlus },
                          { name: 'UserCheck', icon: UserCheck },
                          { name: 'Globe', icon: Globe },
                          { name: 'Wifi', icon: Wifi },
                          { name: 'Smartphone', icon: Smartphone },
                          { name: 'Tablet', icon: Tablet },
                          { name: 'Monitor', icon: Monitor },
                          { name: 'Laptop', icon: Laptop },
                          { name: 'Camera', icon: Camera },
                          { name: 'Video', icon: Video },
                          { name: 'Music', icon: Music },
                          { name: 'Headphones', icon: Headphones },
                          { name: 'Mic', icon: Mic },
                          { name: 'Volume2', icon: Volume2 },
                          { name: 'Building', icon: Building },
                          { name: 'Building2', icon: Building2 },
                          { name: 'Store', icon: Store },
                          { name: 'Warehouse', icon: Warehouse },
                        ].map(({ name, icon: IconComponent }) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setIcon(name);
                              setShowIconPicker(false);
                            }}
                            className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-left"
                          >
                            <IconComponent className="w-4 h-4" />
                            <span className="text-sm">{name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowElementLibrary(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                  Add Element
                </button>
              </div>
            </div>
          </div>

          {/* Screen Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Screen Elements ({selectedElements.length})</h2>
              
              {selectedElements.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No elements added</h3>
                  <p className="text-gray-500 mb-4">Click "Add Element" to start building your screen</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedElements.map((element, index) => (
                    <div
                      key={element.temp_id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 pt-1">
                          <button
                            onClick={() => moveElement(element.temp_id, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium text-gray-900">{element.label}</div>
                              <div className="text-sm text-gray-500">{element.element.element_type}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingElement(element)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeElement(element.temp_id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Field Key:</span>
                              <span className="ml-2 font-mono text-xs">{element.field_key}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Required:</span>
                              <span className="ml-2">{element.is_required ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Element Library Modal */}
      {showElementLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add Element</h2>
                <button
                  onClick={() => setShowElementLibrary(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              <div className="grid grid-cols-2 gap-4">
                {filteredElements.map(element => (
                  <button
                    key={element.id}
                    onClick={() => addElement(element)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">{element.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{element.element_type}</div>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {element.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Element Editor Modal */}
      {editingElement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Element</h2>
                <button
                  onClick={() => setEditingElement(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    defaultValue={editingElement.label || ''}
                    onChange={(e) => {
                      const newLabel = e.target.value;
                      const newFieldKey = generateScreenKey(newLabel);
                      updateElement(editingElement.temp_id, { 
                        label: newLabel,
                        field_key: newFieldKey 
                      });
                    }}
                    autoFocus
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Key</label>
                  <input
                    type="text"
                    value={editingElement.field_key || ''}
                    onChange={(e) => updateElement(editingElement.temp_id, { field_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                </div>

                {Boolean(editingElement.element.is_input_field) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                      <input
                        type="text"
                        defaultValue={editingElement.placeholder || ''}
                        onBlur={(e) => updateElement(editingElement.temp_id, { placeholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
                      <input
                        type="text"
                        defaultValue={editingElement.default_value || ''}
                        onBlur={(e) => updateElement(editingElement.temp_id, { default_value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingElement.is_required}
                          onChange={(e) => updateElement(editingElement.temp_id, { is_required: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Required</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingElement.is_readonly}
                          onChange={(e) => updateElement(editingElement.temp_id, { is_readonly: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Read Only</span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <button
                onClick={() => setEditingElement(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditingElement(null);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
