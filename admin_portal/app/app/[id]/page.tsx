"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { appsAPI, permissionsAPI, appScreensAPI } from "@/lib/api";
import AppLayout from "@/components/layouts/AppLayout";
import {
  Users,
  Monitor,
  Settings as SettingsIcon,
  Activity,
} from "lucide-react";

export default function AppDashboard() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScreens: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for token
    const token = localStorage.getItem("auth_token");

    if (!token && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Wait for user data to load
    if (token && !user) {
      return;
    }

    fetchAppData();
  }, [isAuthenticated, user, params.id, router]);

  const fetchAppData = async () => {
    try {
      const appId = parseInt(params.id as string);

      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      setApp(appResponse.data);

      // Fetch user permissions for this app
      if (user?.id) {
        // Master Admins have full access to all apps
        if (user.role_level === 1) {
          setPermissions({
            can_view: true,
            can_edit: true,
            can_delete: true,
            can_publish: true,
            can_manage_users: true,
            can_manage_settings: true,
          });
        } else {
          const permsResponse = await permissionsAPI.getUserPermissions(
            user.id
          );
          const userPerms = permsResponse.data?.find(
            (p: any) => p.app_id === appId
          );

          if (!userPerms) {
            // User doesn't have access to this app
            router.push("/master");
            return;
          }

          setPermissions(userPerms);
        }
      }

      // Fetch stats
      const usersResponse = await permissionsAPI.getAppUsers(appId);
      const screensResponse = await appScreensAPI.getAppScreens(appId);

      setStats({
        totalUsers: usersResponse.data?.length || 0,
        totalScreens: Array.isArray(screensResponse.data)
          ? screensResponse.data.length
          : 0,
        recentActivity: 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching app data:", error);
      setLoading(false);
      router.push("/master");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return null;
  }

  const quickActions = [
    {
      name: "Manage Users",
      description: "Add, edit, or remove users",
      icon: Users,
      href: `/app/${params.id}/users`,
      color: "bg-blue-500",
      visible: permissions?.can_manage_users,
    },
    {
      name: "Manage Screens",
      description: "Create and edit app screens",
      icon: Monitor,
      href: `/app/${params.id}/screens`,
      color: "bg-green-500",
      visible: permissions?.can_edit,
    },
    {
      name: "Services",
      description: "Manage in-app services",
      icon: SettingsIcon,
      href: `/app/${params.id}/services`,
      color: "bg-red-500",
      visible: permissions?.can_edit,
    },
    {
      name: "Settings",
      description: "Configure app settings",
      icon: SettingsIcon,
      href: `/app/${params.id}/settings`,
      color: "bg-purple-500",
      visible: permissions?.can_manage_settings,
    },
  ];

  const statCards = [
    {
      name: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Total Screens",
      value: stats.totalScreens,
      icon: Monitor,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Recent Activity",
      value: stats.recentActivity,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <AppLayout appId={params.id as string} appName={app.name}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to {app.name} management dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions
              .filter((action) => action.visible)
              .map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => router.push(action.href)}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
                  >
                    <div
                      className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Application Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">App Name</p>
              <p className="text-base text-gray-900 mt-1">{app.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Domain</p>
              <p className="text-base text-gray-900 mt-1">{app.domain}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-base text-gray-900 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    app.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.is_active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Your Permissions
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {permissions?.can_view && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    View
                  </span>
                )}
                {permissions?.can_edit && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Edit
                  </span>
                )}
                {permissions?.can_delete && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    Delete
                  </span>
                )}
                {permissions?.can_manage_users && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    Manage Users
                  </span>
                )}
                {permissions?.can_manage_settings && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    Manage Settings
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
