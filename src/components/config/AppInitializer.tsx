'use client';

import React, { useEffect, useState } from 'react';
import { ConfigError } from '@/components/ui/config-error';
import { isAppConfigured, getMissingEnvVars } from '@/lib/init';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [missingVars, setMissingVars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkConfiguration = async () => {
    setIsLoading(true);
    try {
      const configured = await isAppConfigured();
      setIsConfigured(configured);
      
      if (!configured) {
        const missing = await getMissingEnvVars();
        setMissingVars(missing);
      }
    } catch (error) {
      console.error('Error checking app configuration:', error);
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">
          Initializing application...
        </div>
      </div>
    );
  }

  if (isConfigured === false) {
    return <ConfigError missingVars={missingVars} onRetry={checkConfiguration} />;
  }

  return <>{children}</>;
} 