'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized ) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return <>{children}</>;
}
