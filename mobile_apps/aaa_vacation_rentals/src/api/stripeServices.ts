import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../api/config';

export async function createCheckoutSession(
  token: string,
  bookingPayload: any,
) {
  const url = `${API_CONFIG.BASE_URL}${ENDPOINTS.PAYMENTS.CHECKOUT}`;
  const res = await axios.post(url, bookingPayload, {
    headers: { Authorization: `Bearer ${token}` },
    timeout: API_CONFIG.TIMEOUT,
  });
  return res.data;
}

// --- Service discovery + safe wrapper ---
type ServiceObject = {
  id: number;
  app_id: number;
  service_name: string;
  service_id: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

type EnabledServicesResp = { services: ServiceObject[] };

const CACHE_TTL_MS = 60_000; // 60s cache; tune as needed
const enabledCache: Record<string, { until: number; services: string[] }> = {};

async function fetchEnabledServices(
  appId: string,
  token?: string,
): Promise<string[]> {
  const now = Date.now();
  const cached = enabledCache[appId];
  if (cached && cached.until > now) {
    console.log(
      '[fetchEnabledServices] Using cached services:',
      cached.services,
    );
    return cached.services;
  }

  const url = `${API_CONFIG.BASE_URL}/apps/${appId}/services/enabled`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  console.log('[fetchEnabledServices] Fetching from:', url);
  console.log('[fetchEnabledServices] Has token:', !!token);

  const res = await axios.get<EnabledServicesResp>(url, {
    headers,
    timeout: API_CONFIG.TIMEOUT,
  });
  if (!res || !res.data) throw new Error('Failed to fetch enabled services');

  console.log(
    '[fetchEnabledServices] Raw API response:',
    JSON.stringify(res.data, null, 2),
  );

  // Extract service names from service objects
  const serviceNames = res.data.services.map(s => s.service_name);

  console.log('[fetchEnabledServices] Extracted service names:', serviceNames);

  enabledCache[appId] = {
    until: now + CACHE_TTL_MS,
    services: serviceNames,
  };
  return serviceNames;
}

export async function isStripeEnabled(
  appId: string,
  token?: string,
): Promise<boolean> {
  try {
    const services = await fetchEnabledServices(appId, token);
    console.log(
      '[isStripeEnabled] Enabled services for app',
      appId,
      ':',
      services,
    );
    // Check for various stripe service names
    const enabled = services.some(
      s =>
        s === 'stripe' ||
        s === 'payments' ||
        s === 'stripe-service' ||
        s.toLowerCase().includes('stripe'),
    );
    console.log('[isStripeEnabled] Stripe/payments enabled:', enabled);
    return enabled;
  } catch (err) {
    // Conservative fallback: treat as disabled if discovery fails
    console.error('[isStripeEnabled] Error checking services:', err);
    return false;
  }
}

// Safe wrapper that checks service enablement and then calls the server proxy.
// Uses the proxy path `/api/v1/apps/:appId/checkout` unless `ENDPOINTS.PAYMENTS.CHECKOUT`
// contains a templated `{appId}` segment.
export async function createCheckoutSessionWithCheck(
  appId: string,
  token: string,
  bookingPayload: any,
  useInAppPayment: boolean = true,
) {
  const enabled = await isStripeEnabled(appId, token);
  if (!enabled) throw new Error('Payments are not enabled for this app');

  let checkoutPath =
    ENDPOINTS && ENDPOINTS.PAYMENTS && ENDPOINTS.PAYMENTS.CHECKOUT
      ? ENDPOINTS.PAYMENTS.CHECKOUT
      : '/api/v1/apps/{appId}/checkout';

  if (checkoutPath.includes('{appId}')) {
    checkoutPath = checkoutPath.replace('{appId}', encodeURIComponent(appId));
  }

  const url = checkoutPath.startsWith('http')
    ? checkoutPath
    : `${API_CONFIG.BASE_URL}${checkoutPath}`;

  const payload = {
    ...bookingPayload,
    payment_method: useInAppPayment ? 'payment_intent' : 'checkout_session',
  };

  console.log('[createCheckoutSessionWithCheck] Calling checkout URL:', url);
  console.log(
    '[createCheckoutSessionWithCheck] Payload:',
    JSON.stringify(payload, null, 2),
  );

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: API_CONFIG.TIMEOUT,
    });

    console.log('[createCheckoutSessionWithCheck] Success response:', res.data);
    return res.data; // Expect { url, sessionId, clientSecret } — adapt as needed
  } catch (err: any) {
    // Normalize axios errors so callers get a clear message (esp. 409 conflicts)
    console.error(
      '[createCheckoutSessionWithCheck] Error response:',
      err?.response?.data,
    );
    console.error(
      '[createCheckoutSessionWithCheck] Error status:',
      err?.response?.status,
    );
    const serverMessage = err?.response?.data?.message;
    const message = serverMessage || err?.message || 'Payment request failed';
    // Create an error with the message but preserve response data for additional context
    const error: any = new Error(message);
    if (err?.response) {
      error.response = err.response;
    }
    throw error;
  }
}
