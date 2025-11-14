'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCog, Monitor, Settings, ArrowLeft, LogOut, Shield, Home } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { permissionsAPI, appsAPI } from '@/lib/api';

interface AppLayoutProps {
  children: React.ReactNode;
  appId: string;
  appName: string;
}

export default function AppLayout({ children, appId, appName }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [userAppCount, setUserAppCount] = useState<number>(0);
  const [hasPropertyListings, setHasPropertyListings] = useState<boolean>(false);

  useEffect(() => {
    // Fetch user's app count to determine if we should show "Back" button
    if (user?.id) {
      permissionsAPI.getUserPermissions(user.id)
        .then((response) => {
          setUserAppCount(response.data?.length || 0);
        })
        .catch((error) => {
          console.error('Error fetching user apps:', error);
        });
    }
    
    // Check if app has property listings by checking for listings data
    if (appId) {
      // Try to fetch listings - if successful and has data, show menu item
      appsAPI.getById(parseInt(appId))
        .then((response) => {
          // Check if app was created from Property Rental template (ID: 9)
          // OR check if it has property listing screens added
          const templateId = response.data?.template_id;
          if (templateId === 9) {
            setHasPropertyListings(true);
          } else {
            // Check if app has property listing screens by looking for specific screen names
            // For now, always show for Property Rental template apps
            // In future, could check app_screens for property-related screens
            setHasPropertyListings(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching app details:', error);
          setHasPropertyListings(false);
        });
    }
  }, [user, appId]);

  const baseMenuItems = [
    {
      name: 'Dashboard',
      href: `/app/${appId}`,
      icon: LayoutDashboard,
    },
    {
      name: 'Administrators',
      href: `/app/${appId}/users`,
      icon: UserCog,
    },
    {
      name: 'App Users',
      href: `/app/${appId}/app-users`,
      icon: Users,
    },
    {
      name: 'App Users Roles',
      href: `/app/${appId}/roles`,
      icon: Shield,
    },
    {
      name: 'Screens',
      href: `/app/${appId}/screens`,
      icon: Monitor,
    },
  ];

  // Template-specific menu items
  const templateMenuItems: any = [];
  
  // Show Property Listings if app has this feature
  if (hasPropertyListings) {
    templateMenuItems.push({
      name: 'Property Listings',
      href: `/app/${appId}/listings`,
      icon: Home,
    });
  }
  
  // Add Settings at the end
  const menuItems = [
    ...baseMenuItems,
    ...templateMenuItems,
    {
      name: 'Settings',
      href: `/app/${appId}/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === `/app/${appId}`) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          {/* Only show back button if user is master admin OR has multiple apps */}
          {(user?.role_level === 1 || userAppCount > 1) && (
            <button
              onClick={() => router.push(user?.role_level === 1 ? '/master' : '/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">
                {user?.role_level === 1 ? 'Back to Master' : 'Back to Dashboard'}
              </span>
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{appName}</h1>
          <p className="text-sm text-gray-500 mt-1">Application Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.href}>
                  <button
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
