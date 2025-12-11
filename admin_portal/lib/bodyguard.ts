/**
 * Bluestone Bodyguard Client for Admin Portal
 * Generic gateway client - no service-specific logic
 * Services define their own capabilities and requirements
 */

const BODYGUARD_URL =
  process.env.NEXT_PUBLIC_BODYGUARD_URL || "http://localhost:3032";

interface GatewayMessage {
  version: number;
  id: string;
  trace_id: string;
  timestamp_ms: number;
  source: Endpoint;
  destination: Endpoint;
  kind: "Request" | "Response" | "Event" | "Error";
  type: string;
  auth?: AuthContext;
  payload: any;
}

interface Endpoint {
  kind: "App" | "Gateway" | "Service" | "Main";
  name: string;
  url: string;
  instance_id?: string;
  params?: any;
}

interface AuthContext {
  user_id: string;
  tenant_id: string;
  roles: string[];
}

class BodyguardClient {
  private bodyguardUrl: string;
  private sourceEndpoint: Endpoint;

  constructor() {
    this.bodyguardUrl = BODYGUARD_URL;
    this.sourceEndpoint = {
      kind: "App",
      name: "admin-portal",
      url:
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3001",
      instance_id: "admin-portal-1",
    };
  }

  /**
   * Send a generic request to any service through Bodyguard
   * Service determines how to handle the request based on type
   */
  async sendToService(
    serviceName: string,
    requestType: string,
    payload: any,
    auth?: { userId: string; appId?: string; roles?: string[] }
  ): Promise<any> {
    const message: GatewayMessage = {
      version: 1,
      id: this.generateId(),
      trace_id: this.generateTraceId(),
      timestamp_ms: Date.now(),
      source: this.sourceEndpoint,
      destination: {
        kind: "Service",
        name: serviceName,
        url: "", // Bodyguard will resolve this
        instance_id: undefined,
      },
      kind: "Request",
      type: requestType,
      auth: auth
        ? {
            user_id: auth.userId,
            tenant_id: auth.appId || "default",
            roles: auth.roles || [],
          }
        : undefined,
      payload,
    };

    try {
      const response = await fetch(`${this.bodyguardUrl}/gateway/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`Bodyguard request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Bodyguard communication error:", error);
      throw error;
    }
  }

  /**
   * Get list of registered services with their capabilities
   */
  async getRegisteredServices(): Promise<any> {
    try {
      const response = await fetch(`${this.bodyguardUrl}/services`);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to get registered services:", error);
      return null;
    }
  }

  /**
   * Query a service for its configuration schema
   * Services should respond with what settings they need
   */
  async getServiceSchema(
    serviceName: string,
    auth?: AuthContext
  ): Promise<any> {
    // Temporary: Call service directly until Bodyguard has message routing
    const services = await this.getRegisteredServices();
    const service = services?.services?.find(
      (s: any) => s.name === serviceName
    );

    if (!service || !service.endpoints || service.endpoints.length === 0) {
      throw new Error(`Service ${serviceName} not found or has no endpoints`);
    }

    // Get the service URL from the first endpoint and convert Docker internal URL to localhost
    let serviceUrl = service.endpoints[0].url.replace(/\/api\/v1\/.*$/, "");
    serviceUrl = serviceUrl.replace(
      "http://stripe_service:4001",
      "http://localhost:4001"
    );

    try {
      const response = await fetch(`${serviceUrl}/service/getSchema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get schema: ${response.statusText}`);
      }

      const data = await response.json();
      return { payload: data };
    } catch (error) {
      console.error(`Failed to get schema for ${serviceName}:`, error);
      throw error;
    }
  }

  /**
   * Get service configuration for a specific app/project
   */
  async getServiceConfig(
    serviceName: string,
    appId: string,
    auth?: { userId: string; appId?: string; roles?: string[] }
  ): Promise<any> {
    const services = await this.getRegisteredServices();
    const service = services?.services?.find(
      (s: any) => s.name === serviceName
    );

    if (!service || !service.endpoints || service.endpoints.length === 0) {
      throw new Error(`Service ${serviceName} not found`);
    }

    let serviceUrl = service.endpoints[0].url.replace(/\/api\/v1\/.*$/, "");
    serviceUrl = serviceUrl.replace(
      "http://stripe_service:4001",
      "http://localhost:4001"
    );

    const response = await fetch(`${serviceUrl}/service/getConfig`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId }),
    });

    if (!response.ok)
      throw new Error(`Failed to get config: ${response.statusText}`);
    const data = await response.json();
    return { payload: data };
  }

  /**
   * Update service configuration for a specific app/project
   */
  async updateServiceConfig(
    serviceName: string,
    appId: string,
    config: any,
    auth?: { userId: string; appId?: string; roles?: string[] }
  ): Promise<any> {
    const services = await this.getRegisteredServices();
    const service = services?.services?.find(
      (s: any) => s.name === serviceName
    );

    if (!service || !service.endpoints || service.endpoints.length === 0) {
      throw new Error(`Service ${serviceName} not found`);
    }

    let serviceUrl = service.endpoints[0].url.replace(/\/api\/v1\/.*$/, "");
    serviceUrl = serviceUrl.replace(
      "http://stripe_service:4001",
      "http://localhost:4001"
    );

    const response = await fetch(`${serviceUrl}/service/updateConfig`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, config }),
    });

    if (!response.ok)
      throw new Error(`Failed to update config: ${response.statusText}`);
    const data = await response.json();
    return { payload: data };
  }

  /**
   * Test service connection for a specific app/project
   */
  async testServiceConnection(
    serviceName: string,
    appId: string,
    auth?: { userId: string; appId?: string; roles?: string[] }
  ): Promise<any> {
    const services = await this.getRegisteredServices();
    const service = services?.services?.find(
      (s: any) => s.name === serviceName
    );

    if (!service || !service.endpoints || service.endpoints.length === 0) {
      throw new Error(`Service ${serviceName} not found`);
    }

    let serviceUrl = service.endpoints[0].url.replace(/\/api\/v1\/.*$/, "");
    serviceUrl = serviceUrl.replace(
      "http://stripe_service:4001",
      "http://localhost:4001"
    );

    const response = await fetch(`${serviceUrl}/service/testConnection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId }),
    });

    if (!response.ok)
      throw new Error(`Failed to test connection: ${response.statusText}`);
    const data = await response.json();
    return { payload: data };
  }

  /**
   * Check if Bodyguard is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.bodyguardUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
const bodyguardClient = new BodyguardClient();

export default bodyguardClient;
export { BodyguardClient };
export type { GatewayMessage, Endpoint, AuthContext };
