"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import serviceManager from "@/lib/serviceManager";

interface Service {
  name: string;
  id: string;
  version: number;
  description: string;
}

interface ServiceSchema {
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "password" | "number" | "boolean";
    required: boolean;
    description?: string;
    placeholder?: string;
  }>;
  capabilities?: string[];
}

export default function IntegrationsPage() {
  const params = useParams();
  const appId = params.id as string;

  const [services, setServices] = useState<Service[]>([]);
  const [enabledServices, setEnabledServices] = useState<Set<string>>(
    new Set()
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [schema, setSchema] = useState<ServiceSchema | null>(null);
  const [config, setConfig] = useState<Record<string, any>>({});
  const [currentConfig, setCurrentConfig] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadServices();
    loadEnabledServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      loadServiceSchema();
      loadServiceConfig();
    }
  }, [selectedService]);

  const loadServices = async () => {
    try {
      const result = await serviceManager.discoverServices();
      if (result && result.services) {
        setServices(result.services);
      }
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const loadEnabledServices = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/apps/${appId}/services/enabled`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.services) {
          setEnabledServices(
            new Set(data.services.map((s: any) => s.service_name))
          );
        }
      }
    } catch (error) {
      console.error("Failed to load enabled services:", error);
    }
  };

  const loadServiceSchema = async () => {
    if (!selectedService) return;

    try {
      const result = await serviceManager.getServiceSchema(
        selectedService.name
      );
      setSchema(result);
    } catch (error) {
      console.error("Failed to load service schema:", error);
      setSchema(null);
    }
  };

  const loadServiceConfig = async () => {
    if (!selectedService) return;

    try {
      const result = await serviceManager.getServiceConfig(
        selectedService.name,
        appId
      );
      setCurrentConfig(result || {});
    } catch (error) {
      console.error("Failed to load service config:", error);
      setCurrentConfig({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await serviceManager.updateServiceConfig(
        selectedService.name,
        appId,
        config
      );

      setMessage({
        type: "success",
        text: result.message || "Configuration updated successfully",
      });

      setConfig({});
      await loadServiceConfig();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update configuration",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!selectedService) return;

    setTesting(true);
    setMessage(null);

    try {
      const result = await serviceManager.testServiceConnection(
        selectedService.name,
        appId
      );

      setMessage({
        type: "success",
        text: result.message || "Connection test successful",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Connection test failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const renderField = (field: ServiceSchema["fields"][0]) => {
    const value = config[field.name] || "";

    switch (field.type) {
      case "password":
        return (
          <input
            type="password"
            value={value}
            onChange={(e) =>
              setConfig({ ...config, [field.name]: e.target.value })
            }
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setConfig({ ...config, [field.name]: parseFloat(e.target.value) })
            }
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "boolean":
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) =>
              setConfig({ ...config, [field.name]: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setConfig({ ...config, [field.name]: e.target.value })
            }
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Service Integrations</h1>
        <p className="text-gray-600">
          Configure third-party services for this project
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Services List */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Available Services</h2>

            {services.length === 0 ? (
              <p className="text-sm text-gray-500">No services available</p>
            ) : services.filter((s) => enabledServices.has(s.name)).length ===
              0 ? (
              <div className="text-sm text-gray-500">
                <p className="mb-2">No services enabled for this project.</p>
                <p className="text-xs">
                  Go to <strong>Services</strong> page to enable services.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {services
                  .filter((s) => enabledServices.has(s.name))
                  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedService?.id === service.id
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {service.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        v{service.version}
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="md:col-span-2">
          {!selectedService ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              Select a service to configure
            </div>
          ) : (
            <>
              {/* Current Configuration */}
              {Object.keys(currentConfig).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h2 className="font-semibold text-green-900 mb-2">
                    ✓ Configured
                  </h2>
                  <p className="text-sm text-green-800">
                    This service is configured for this project
                  </p>
                </div>
              )}

              {/* Message Display */}
              {message && (
                <div
                  className={`rounded-lg p-4 mb-6 ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Configuration Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Configure {selectedService.name}
                </h2>

                {!schema ? (
                  <p className="text-gray-500">
                    Loading configuration schema...
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {schema.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && "*"}
                        </label>
                        {renderField(field)}
                        {field.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {field.description}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? "Saving..." : "Save Configuration"}
                      </button>

                      {Object.keys(currentConfig).length > 0 && (
                        <button
                          type="button"
                          onClick={handleTest}
                          disabled={testing}
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {testing ? "Testing..." : "Test Connection"}
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Capabilities */}
                {schema?.capabilities && schema.capabilities.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {schema.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
