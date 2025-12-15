"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { appsAPI, permissionsAPI } from "@/lib/api";
import AppLayout from "@/components/layouts/AppLayout";
import {
  Settings as SettingsIcon,
  Save,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/Button";
import serviceManager from "@/lib/serviceManager";

export default function AppSettings() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingApp, setSavingApp] = useState(false);
  const [enabledServices, setEnabledServices] = useState<any[]>([]);
  const [serviceSchemas, setServiceSchemas] = useState<Record<string, any>>({});
  const [serviceConfigs, setServiceConfigs] = useState<Record<string, any>>({});
  const [savingService, setSavingService] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    section: string;
  } | null>(null);

  // App info form
  const [appForm, setAppForm] = useState({
    name: "",
    description: "",
  });

  // Service forms - dynamic based on enabled services
  const [serviceForms, setServiceForms] = useState<
    Record<string, Record<string, any>>
  >({});

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (token && !user) {
      return;
    }

    fetchData();
    loadEnabledServices();
  }, [isAuthenticated, user, params.id, router]);

  const fetchData = async () => {
    try {
      const appId = parseInt(params.id as string);

      // Fetch app details
      const appResponse = await appsAPI.getById(appId);
      const appData = appResponse.data;
      setApp(appData);

      // Initialize forms with app data
      setAppForm({
        name: appData.name || "",
        description: appData.description || "",
      });

      // Check user permissions
      if (user?.id) {
        // Master Admins have full access to all apps
        if (user.role_level !== 1) {
          const permsResponse = await permissionsAPI.getUserPermissions(
            user.id
          );
          const userPerms = permsResponse.data?.find(
            (p: any) => p.app_id === appId
          );

          if (!userPerms || !userPerms.can_manage_settings) {
            router.push(`/app/${appId}`);
            return;
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSaveAppInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingApp(true);
    setMessage(null);

    try {
      await appsAPI.update(parseInt(params.id as string), {
        name: appForm.name,
        description: appForm.description,
      });

      setApp({ ...app, name: appForm.name, description: appForm.description });
      setMessage({
        type: "success",
        text: "App information saved successfully!",
        section: "app",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save app information",
        section: "app",
      });
    } finally {
      setSavingApp(false);
    }
  };

  const loadEnabledServices = async () => {
    try {
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
          setEnabledServices(data.services);

          // Load schema and config for each enabled service
          for (const service of data.services) {
            await loadServiceSchema(service.service_name);
            await loadServiceConfig(service.service_name);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load enabled services:", error);
    }
  };

  const loadServiceSchema = async (serviceName: string) => {
    try {
      const schema = await serviceManager.getServiceSchema(serviceName);
      setServiceSchemas((prev) => ({ ...prev, [serviceName]: schema }));

      // Initialize form with empty values
      const initialForm: Record<string, any> = {};
      if (schema.fields) {
        schema.fields.forEach((field: any) => {
          initialForm[field.name] = "";
        });
      }
      setServiceForms((prev) => ({ ...prev, [serviceName]: initialForm }));
    } catch (error) {
      console.error(`Failed to load schema for ${serviceName}:`, error);
    }
  };

  const loadServiceConfig = async (serviceName: string) => {
    try {
      const config = await serviceManager.getServiceConfig(
        serviceName,
        params.id as string
      );
      setServiceConfigs((prev) => ({ ...prev, [serviceName]: config }));

      // Update form with existing config if available
      if (config && config.configured) {
        setServiceForms((prev) => ({
          ...prev,
          [serviceName]: { ...prev[serviceName], ...config },
        }));
      }
    } catch (error) {
      console.error(`Failed to load config for ${serviceName}:`, error);
    }
  };

  const handleSaveService = async (serviceName: string, e: React.FormEvent) => {
    e.preventDefault();
    setSavingService(serviceName);
    setMessage(null);

    try {
      const config = serviceForms[serviceName];

      // Save to service (which encrypts and returns encrypted config)
      const result = await serviceManager.updateServiceConfig(
        serviceName,
        params.id as string,
        config
      );

      // Save encrypted config to database via API
      if (result.encryptedConfig) {
        const token = localStorage.getItem("auth_token");
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/apps/${params.id}/services/${serviceName}/config`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ config: result.encryptedConfig }),
          }
        );
      }

      setMessage({
        type: "success",
        text: `${serviceName} settings saved successfully!`,
        section: serviceName,
      });

      // Reload config
      await loadServiceConfig(serviceName);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || `Failed to save ${serviceName} settings`,
        section: serviceName,
      });
    } finally {
      setSavingService(null);
    }
  };

  const handleTestService = async (serviceName: string) => {
    try {
      await serviceManager.testServiceConnection(
        serviceName,
        params.id as string
      );
      setMessage({
        type: "success",
        text: `${serviceName} connection test successful!`,
        section: serviceName,
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || `${serviceName} connection test failed`,
        section: serviceName,
      });
    }
  };

  const renderServiceField = (serviceName: string, field: any) => {
    const value = serviceForms[serviceName]?.[field.name] || "";

    const handleChange = (newValue: any) => {
      setServiceForms((prev) => ({
        ...prev,
        [serviceName]: {
          ...prev[serviceName],
          [field.name]: newValue,
        },
      }));
    };

    // Check if this field is already configured
    const isConfigured =
      serviceConfigs[serviceName]?.[
        `has${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`
      ];

    switch (field.type) {
      case "password":
        return (
          <div className="relative">
            <input
              type="password"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={
                isConfigured ? "••••••••••••••••" : field.placeholder
              }
              required={field.required && !isConfigured}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
            {isConfigured && !value && (
              <span className="absolute right-3 top-2.5 text-xs text-green-600 font-medium">
                ✓ Configured
              </span>
            )}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        );

      case "boolean":
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleChange(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        );
    }
  };

  if (loading) {
    return (
      <AppLayout
        appId={params.id as string}
        appName={app?.name || "Loading..."}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!app) {
    return null;
  }

  return (
    <AppLayout appId={params.id as string} appName={app.name}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure settings and enabled services for {app.name}
          </p>
          <a
            href={`/app/${params.id}/services`}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            <ExternalLink className="w-4 h-4" />
            Manage Services
          </a>
        </div>

        <div className="max-w-2xl space-y-8">
          {/* App Information Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  App Information
                </h2>
                <p className="text-sm text-gray-500">Basic app details</p>
              </div>
            </div>

            {message?.section === "app" && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveAppInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  value={appForm.name}
                  onChange={(e) =>
                    setAppForm({ ...appForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={appForm.description}
                  onChange={(e) =>
                    setAppForm({ ...appForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter app description..."
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={savingApp}>
                  <Save className="w-4 h-4 mr-2" />
                  {savingApp ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>

          {/* Enabled Services - Dynamic */}
          {enabledServices.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 mb-2">No services enabled</p>
              <p className="text-sm text-yellow-600">
                Go to the{" "}
                <a href={`/app/${params.id}/services`} className="underline">
                  Services page
                </a>{" "}
                to enable services for this app.
              </p>
            </div>
          ) : (
            enabledServices.map((service) => {
              const schema = serviceSchemas[service.service_name];
              const config = serviceConfigs[service.service_name];

              if (!schema) return null;

              return (
                <div
                  key={service.service_name}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 capitalize">
                          {service.service_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {schema.description || "Service configuration"}
                        </p>
                      </div>
                    </div>
                    {config?.configured && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        ✓ Configured
                      </span>
                    )}
                  </div>

                  {message && message.section === service.service_name && (
                    <div
                      className={`mb-4 p-3 rounded-lg text-sm ${
                        message.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => handleSaveService(service.service_name, e)}
                    className="space-y-4"
                  >
                    {schema.fields?.map((field: any) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        {renderServiceField(service.service_name, field)}
                        {field.description && (
                          <p className="mt-1 text-xs text-gray-500">
                            {field.description}
                          </p>
                        )}
                      </div>
                    ))}

                    {schema.capabilities && schema.capabilities.length > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Capabilities:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {schema.capabilities.map((cap: string) => (
                            <span
                              key={cap}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {schema.documentation && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Documentation:
                        </p>
                        {schema.documentation.setup && (
                          <p className="text-xs text-gray-600 mb-1">
                            <strong>Setup:</strong> {schema.documentation.setup}
                          </p>
                        )}
                        {schema.documentation.webhook && (
                          <p className="text-xs text-gray-600">
                            <strong>Webhook:</strong>{" "}
                            {schema.documentation.webhook}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      {config?.configured && (
                        <button
                          type="button"
                          onClick={() =>
                            handleTestService(service.service_name)
                          }
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Test Connection
                        </button>
                      )}
                      <Button
                        type="submit"
                        disabled={savingService === service.service_name}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {savingService === service.service_name
                          ? "Saving..."
                          : "Save"}
                      </Button>
                    </div>
                  </form>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
