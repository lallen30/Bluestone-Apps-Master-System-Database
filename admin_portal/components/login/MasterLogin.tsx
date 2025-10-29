'use client';

import LoginForm from './LoginForm';
import { Shield } from 'lucide-react';

interface MasterLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string;
}

export default function MasterLogin({ onLogin, error }: MasterLoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Master Admin</h1>
            <p className="text-muted-foreground">
              Sign in to manage all applications
            </p>
          </div>

          {/* Login Form */}
          <LoginForm onSubmit={onLogin} error={error} />

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Master Admin Portal</p>
            <p className="mt-1">Full system access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
