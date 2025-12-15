/**
 * Generic Service Manager
 * Dynamically discovers and interacts with any service through Bodyguard
 * No hardcoded service names or logic
 */

import bodyguardClient from "./bodyguard";

function normalizeBaseUrl(url: string, suffixToStrip: string) {
  const trimmed = url.replace(/\/+$/, "");
  if (trimmed.toLowerCase().endsWith(suffixToStrip.toLowerCase())) {
    return trimmed.slice(0, -suffixToStrip.length);
  }
  return trimmed;
}

function getApiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return normalizeBaseUrl(envUrl, "/api");

  if (typeof window !== "undefined") return window.location.origin;

  return "http://api:3000";
}

/**
 * Get authentication context from localStorage
 */
function getAuthContext() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("auth_token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return {
      userId: user.id?.toString() || "",
      appId: user.app_id?.toString(),
      roles: user.roles || [],
    };
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
}

export const serviceManager = {
  /**
   * Discover all available services
   */
  async discoverServices() {
    try {
      const services = await bodyguardClient.getRegisteredServices();
      return services;
    } catch (error) {
      console.error("Failed to discover services:", error);
      throw error;
    }
  },

  /**
   * Get configuration schema from a service
   * The service defines what settings it needs
   */
  async getServiceSchema(serviceName: string) {
    const auth = getAuthContext();
    try {
      const response = await bodyguardClient.getServiceSchema(
        serviceName,
        auth || undefined
      );
      return response.payload;
    } catch (error) {
      console.error(`Failed to get schema for ${serviceName}:`, error);
      throw error;
    }
  },

  /**
   * Get current configuration for a service and app
   */
  async getServiceConfig(serviceName: string, appId: string) {
    const auth = getAuthContext();
    try {
      const response = await bodyguardClient.getServiceConfig(
        serviceName,
        appId,
        auth || undefined
      );
      return response.payload;
    } catch (error) {
      console.error(`Failed to get config for ${serviceName}:`, error);
      throw error;
    }
  },

  /**
   * Update configuration for a service and app
   */
  async updateServiceConfig(serviceName: string, appId: string, config: any) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    try {
      // Call API directly to update database
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(
        `${apiBaseUrl}/api/v1/apps/${appId}/services/${serviceName}/config`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ config }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update configuration");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to update config for ${serviceName}:`, error);
      throw error;
    }
  },

  /**
   * Test service connection
   */
  async testServiceConnection(serviceName: string, appId: string) {
    const auth = getAuthContext();

    try {
      const response = await bodyguardClient.testServiceConnection(
        serviceName,
        appId,
        auth || undefined
      );
      return response.payload;
    } catch (error) {
      console.error(`Failed to test connection for ${serviceName}:`, error);
      throw error;
    }
  },

  /**
   * Send a generic request to any service
   */
  async sendRequest(serviceName: string, requestType: string, payload: any) {
    const auth = getAuthContext();

    try {
      const response = await bodyguardClient.sendToService(
        serviceName,
        requestType,
        payload,
        auth || undefined
      );
      return response.payload;
    } catch (error) {
      console.error(`Failed to send request to ${serviceName}:`, error);
      throw error;
    }
  },
};

export default serviceManager;
