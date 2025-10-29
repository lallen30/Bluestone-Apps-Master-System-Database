'use client';

import LoginForm from './LoginForm';
import { Globe } from 'lucide-react';

interface AppLoginProps {
  app: any;
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string;
}

export default function AppLogin({ app, onLogin, error }: AppLoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Globe className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{app?.name || 'Admin Portal'}</h1>
            <p className="text-muted-foreground">
              {app?.description || 'Sign in to manage your application'}
            </p>
          </div>

          {/* Login Form */}
          <LoginForm onSubmit={onLogin} error={error} />

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>{app?.domain}</p>
            <p className="mt-1">Admin Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
