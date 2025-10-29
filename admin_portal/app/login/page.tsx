'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, appsAPI } from '@/lib/api';
import { useAuthStore, useAppStore } from '@/lib/store';
import { getDomainInfo } from '@/lib/utils';
import MasterLogin from '@/components/login/MasterLogin';
import AppLogin from '@/components/login/AppLogin';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { setCurrentApp, setIsMasterAdmin } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<any>(null);
  const [isMaster, setIsMaster] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const domainInfo = getDomainInfo();
    if (!domainInfo) return;

    const { domain, isMaster: isMasterDomain } = domainInfo;
    setIsMaster(isMasterDomain);
    setIsMasterAdmin(isMasterDomain);

    if (!isMasterDomain) {
      // Fetch app by domain
      appsAPI
        .getByDomain(domain)
        .then((response) => {
          setApp(response.data);
          setCurrentApp(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('App not found for this domain');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [setCurrentApp, setIsMasterAdmin]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('');
      console.log('Attempting login with:', email);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (response.success) {
        login(response.data.token, response.data.user);
        
        // Redirect based on role
        if (response.data.user.role_level === 1) {
          router.push('/master');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !isMaster) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return isMaster ? (
    <MasterLogin onLogin={handleLogin} error={error} />
  ) : (
    <AppLogin app={app} onLogin={handleLogin} error={error} />
  );
}
