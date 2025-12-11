import React, { useEffect, useState } from 'react';
import { StripeProvider as StripeProviderSDK } from '@stripe/stripe-react-native';
import { API_CONFIG } from '../api/config';
import axios from 'axios';

interface StripeProviderProps {
  children: React.ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [publishableKey, setPublishableKey] = useState<string>('');

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  const fetchPublishableKey = async () => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/apps/${API_CONFIG.APP_ID}/services/stripe-service/config`,
      );

      const config = response.data?.config;
      const key = config?.stripe_publishable_key || config?.publishableKey;

      if (key) {
        setPublishableKey(key);
        console.log('[StripeProvider] Loaded publishable key from database');
      } else {
        console.warn('[StripeProvider] No publishable key found in config');
      }
    } catch (error) {
      console.error('[StripeProvider] Error fetching publishable key:', error);
    }
  };

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <StripeProviderSDK publishableKey={publishableKey}>
      {children}
    </StripeProviderSDK>
  );
};
