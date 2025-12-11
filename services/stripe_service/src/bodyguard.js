const axios = require("axios");

class BodyguardClient {
  constructor(config) {
    this.serviceId = config.serviceId;
    this.serviceName = config.serviceName;
    this.serviceVersion = config.serviceVersion || 1;
    this.serviceDescription = config.serviceDescription || "";
    this.bodyguardUrl = config.bodyguardUrl;
    this.serviceUrl = config.serviceUrl;
    this.registered = false;
  }

  /**
   * Register this service with Bluestone Bodyguard
   */
  async register() {
    try {
      const registrationPayload = {
        name: this.serviceName,
        id: this.serviceId,
        version: this.serviceVersion,
        description: this.serviceDescription,
        endpoints: [
          {
            kind: "Service",
            name: "create-product",
            url: `${this.serviceUrl}/api/v1/stripe/products`,
            instance_id: this.serviceId,
            params: null,
          },
          {
            kind: "Service",
            name: "create-price",
            url: `${this.serviceUrl}/api/v1/stripe/prices`,
            instance_id: this.serviceId,
            params: null,
          },
          {
            kind: "Service",
            name: "create-checkout-session",
            url: `${this.serviceUrl}/api/v1/stripe/checkout-session`,
            instance_id: this.serviceId,
            params: null,
          },
          {
            kind: "Service",
            name: "create-payment-intent",
            url: `${this.serviceUrl}/api/v1/stripe/payment-intent`,
            instance_id: this.serviceId,
            params: null,
          },
          {
            kind: "Service",
            name: "create-customer",
            url: `${this.serviceUrl}/api/v1/stripe/customer`,
            instance_id: this.serviceId,
            params: null,
          },
          {
            kind: "Service",
            name: "create-subscription",
            url: `${this.serviceUrl}/api/v1/stripe/subscription`,
            instance_id: this.serviceId,
            params: null,
          },
          {
            kind: "Service",
            name: "webhook",
            url: `${this.serviceUrl}/api/v1/stripe/webhook`,
            instance_id: this.serviceId,
            params: null,
          },
        ],
      };

      console.log(
        `Registering with Bluestone Bodyguard at ${this.bodyguardUrl}...`
      );
      const response = await axios.post(
        `${this.bodyguardUrl}/services/register`,
        registrationPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      this.registered = true;
      console.log("✅ Successfully registered with Bluestone Bodyguard");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Failed to register with Bluestone Bodyguard:",
        error.message
      );
      if (error.response) {
        console.error("Response:", error.response.data);
      }
      throw error;
    }
  }

  /**
   * Send health check to Bodyguard
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.bodyguardUrl}/health`);
      return response.data;
    } catch (error) {
      console.error("Bodyguard health check failed:", error.message);
      return null;
    }
  }

  /**
   * Get list of registered services from Bodyguard
   */
  async getRegisteredServices() {
    try {
      const response = await axios.get(`${this.bodyguardUrl}/services`);
      return response.data;
    } catch (error) {
      console.error("Failed to get registered services:", error.message);
      return null;
    }
  }
}

module.exports = BodyguardClient;
