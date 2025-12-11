"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Monitor,
  Settings,
  ArrowLeft,
  LogOut,
  Shield,
  Home,
  Menu,
  Calendar,
  Mail,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { permissionsAPI, appsAPI, appScreensAPI } from "@/lib/api";

interface AppLayoutProps {
  children: React.ReactNode;
  appId: string;
  appName: string;
}

interface MenuAccess {
  property_listings: boolean;
  bookings: boolean;
  contact_submissions: boolean;
  menus: boolean;
  app_users: boolean;
  roles: boolean;
}

interface GeneralPermissions {
  can_manage_users: boolean;
  can_manage_settings: boolean;
  can_manage_admins: boolean;
}

const defaultMenuAccess: MenuAccess = {
  property_listings: true,
  bookings: true,
  contact_submissions: true,
  menus: true,
  app_users: true,
  roles: true,
};

const defaultGeneralPermissions: GeneralPermissions = {
  can_manage_users: false,
  can_manage_settings: false,
  can_manage_admins: false,
};

export default function AppLayout({
  children,
  appId,
  appName,
}: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [userAppCount, setUserAppCount] = useState<number>(0);
  const [hasPropertyListings, setHasPropertyListings] =
    useState<boolean>(false);
  const [hasContactScreen, setHasContactScreen] = useState<boolean>(false);
  const [menuAccess, setMenuAccess] = useState<MenuAccess>(defaultMenuAccess);
  const [generalPermissions, setGeneralPermissions] =
    useState<GeneralPermissions>(defaultGeneralPermissions);

  useEffect(() => {
    // Fetch user's app count and permissions to determine menu access
    if (user?.id) {
      permissionsAPI
        .getUserPermissions(user.id)
        .then((response) => {
          setUserAppCount(response.data?.length || 0);

          // Find permissions for this specific app
          const appPerms = response.data?.find(
            (p: any) => p.app_id === parseInt(appId)
          );

          // Master Admin has full access
          if (user.role_level === 1) {
            setMenuAccess(defaultMenuAccess);
            setGeneralPermissions({
              can_manage_users: true,
              can_manage_settings: true,
              can_manage_admins: true,
            });
          } else if (appPerms) {
            // Set general permissions from app permissions
            setGeneralPermissions({
              can_manage_users: !!appPerms.can_manage_users,
              can_manage_settings: !!appPerms.can_manage_settings,
              can_manage_admins: !!appPerms.can_manage_admins,
            });

            // Parse custom permissions for menu access
            if (appPerms.custom_permissions) {
              try {
                const customPerms =
                  typeof appPerms.custom_permissions === "string"
                    ? JSON.parse(appPerms.custom_permissions)
                    : appPerms.custom_permissions;

                if (customPerms?.menu_access) {
                  setMenuAccess({
                    ...defaultMenuAccess,
                    ...customPerms.menu_access,
                  });
                }
              } catch (e) {
                console.error("Error parsing custom permissions:", e);
              }
            }
          } else {
            // No permissions - hide everything
            setGeneralPermissions(defaultGeneralPermissions);
          }
        })
        .catch((error) => {
          console.error("Error fetching user apps:", error);
        });
    }

    // Check if app has property listings and contact screen
    if (appId) {
      // Try to fetch app details
      appsAPI
        .getById(parseInt(appId))
        .then((response) => {
          // Check if app was created from Property Rental template (ID: 9)
          const templateId = response.data?.template_id;
          if (templateId === 9) {
            setHasPropertyListings(true);
          } else {
            setHasPropertyListings(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching app details:", error);
          setHasPropertyListings(false);
        });

      // Check if app has Contact Us screen
      appScreensAPI
        .getAppScreens(parseInt(appId))
        .then((response) => {
          const screens = Array.isArray(response.data) ? response.data : [];
          // Check if any screen name contains "Contact" (case-insensitive)
          const hasContact = screens.some((screen: any) =>
            screen.name?.toLowerCase().includes("contact")
          );
          setHasContactScreen(hasContact);
        })
        .catch((error) => {
          console.error("Error fetching app screens:", error);
          setHasContactScreen(false);
        });
    }
  }, [user, appId]);

  // Build menu items based on permissions
  const baseMenuItems = [
    {
      name: "Dashboard",
      href: `/app/${appId}`,
      icon: LayoutDashboard,
      always: true, // Always show dashboard
    },
    {
      name: "Administrators",
      href: `/app/${appId}/users`,
      icon: UserCog,
      requiresManageAdmins: true, // Requires can_manage_admins permission
    },
    {
      name: "App Users",
      href: `/app/${appId}/app-users`,
      icon: Users,
      requiresManageUsers: true, // Requires can_manage_users permission
    },
    {
      name: "App Users Roles",
      href: `/app/${appId}/roles`,
      icon: Shield,
      requiresManageUsers: true, // Requires can_manage_users permission
    },
    {
      name: "Screens",
      href: `/app/${appId}/screens`,
      icon: Monitor,
      always: true, // Core functionality
    },
    {
      name: "Menus",
      href: `/app/${appId}/menus`,
      icon: Menu,
      accessKey: "menus" as keyof MenuAccess,
    },
    {
      name: "Services",
      href: `/app/${appId}/services`,
      icon: UserCog,
      requiresManageAdmins: true, // Requires can_manage_admins permission
    },
  ].filter((item) => {
    if (item.always) return true;
    if (item.requiresManageAdmins) return generalPermissions.can_manage_admins;
    if (item.requiresManageUsers) return generalPermissions.can_manage_users;
    if (item.accessKey) return menuAccess[item.accessKey as keyof MenuAccess];
    return true;
  });

  // Template-specific menu items
  const templateMenuItems: any[] = [];

  // Show Property Listings if app has this feature
  if (hasPropertyListings) {
    if (menuAccess.property_listings) {
      templateMenuItems.push({
        name: "Property Listings",
        href: `/app/${appId}/listings`,
        icon: Home,
      });
    }
    if (menuAccess.bookings) {
      templateMenuItems.push({
        name: "Bookings",
        href: `/app/${appId}/bookings`,
        icon: Calendar,
      });
    }
  }

  // Show Contact Submissions if app has a Contact screen (for ALL apps, not just Property Rental)
  if (hasContactScreen && menuAccess.contact_submissions) {
    templateMenuItems.push({
      name: "Contact Submissions",
      href: `/app/${appId}/contact-submissions`,
      icon: Mail,
    });
  }

  // Add Settings at the end (only if user has can_manage_settings permission)
  const menuItems = [
    ...baseMenuItems,
    ...templateMenuItems,
    ...(generalPermissions.can_manage_settings
      ? [
          {
            name: "Settings",
            href: `/app/${appId}/settings`,
            icon: Settings,
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
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
              onClick={() =>
                router.push(user?.role_level === 1 ? "/master" : "/dashboard")
              }
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">
                {user?.role_level === 1
                  ? "Back to Master"
                  : "Back to Dashboard"}
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
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-small">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <button
            onClick={() => router.push("/profile")}
            className="w-full flex items-center justify-between p-3 mb-3 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </button>
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
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
