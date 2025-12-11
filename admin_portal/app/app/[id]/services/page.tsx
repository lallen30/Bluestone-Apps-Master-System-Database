"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useServicesStore } from "@/lib/store";
import AppLayout from "@/components/layouts/AppLayout";
import { Settings, Activity, Globe, PlusCircle } from "lucide-react";

export default function AppServicesPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const services = useServicesStore((s) => s.services);

  // enabled services for THIS app
  const [enabled, setEnabled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (token && !user) return;

    loadEnabledServices();
  }, [isAuthenticated, user, router, params.id]);

  const loadEnabledServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/apps/${params.id}/services/enabled`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.services) {
          setEnabled(new Set(data.services.map((s: any) => s.service_name)));
        }
      }
    } catch (error) {
      console.error("Failed to load enabled services:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ instant enable / disable with backend sync
  const toggleEnable = async (serviceName: string, serviceId: string) => {
    const isEnabling = !enabled.has(serviceName);

    // optimistic UI update
    setEnabled((prev) => {
      const next = new Set(prev);
      isEnabling ? next.add(serviceName) : next.delete(serviceName);
      return next;
    });

    // backend sync
    try {
      const token = localStorage.getItem("auth_token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/apps/${params.id}/services/${
          isEnabling ? "enable" : "disable"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_name: serviceName,
            service_id: serviceId,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to toggle service:", error);
      // Revert on error
      setEnabled((prev) => {
        const next = new Set(prev);
        isEnabling ? next.delete(serviceName) : next.add(serviceName);
        return next;
      });
    }
  };

  // ✅ Active Endpoints = ONLY enabled services
  const activeEndpointCount = useMemo(() => {
    return services
      .filter((s) => enabled.has(s.name))
      .reduce(
        (acc, s) => acc + (Array.isArray(s.endpoints) ? s.endpoints.length : 0),
        0
      );
  }, [services, enabled]);

  const stats = [
    {
      name: "Total Services",
      value: services.length,
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Active Endpoints",
      value: activeEndpointCount,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <AppLayout appId={params.id as string} appName="Services">
      {" "}
      <div className="p-8">
        {/* Header */}{" "}
        <div className="mb-8 flex items-center justify-between">
          {" "}
          <div>
            {" "}
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>{" "}
            <p className="text-gray-600 mt-2">
              Live enable / disable routing for this application{" "}
            </p>{" "}
          </div>
          <button
            onClick={() => router.push(`/app/${params.id}/services/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <PlusCircle className="w-4 h-4" />
            Register Service
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat) => {
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
        {/* Services Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Services
            </h2>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Endpoints
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {services.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No services registered yet.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr
                      key={service.id}
                      className={`relative transition ${
                        enabled.has(service.name)
                          ? "bg-green-50 ring-1 ring-green-400"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={enabled.has(service.name)}
                          onChange={() =>
                            toggleEnable(service.name, service.id)
                          }
                          className="accent-blue-500"
                          disabled={loading}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.description}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {service.id}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        v{service.version}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {service.endpoints?.map((ep: any, i: number) => (
                          <div key={i} className="mb-1">
                            <div className="font-medium">{ep.name}</div>
                            <div className="text-xs text-gray-500">
                              {ep.url}
                            </div>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
