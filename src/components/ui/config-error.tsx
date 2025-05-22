'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfigErrorProps {
  missingVars: string[];
  onRetry?: () => void;
}

export function ConfigError({ missingVars, onRetry }: ConfigErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-center">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Configuration Error</h1>
        <p className="text-gray-600 mb-6">
          The application is missing required environment variables and cannot function properly.
        </p>
        
        <div className="bg-gray-100 p-4 rounded-md text-left mb-6 overflow-auto max-h-60">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Missing environment variables:</h2>
          <ul className="list-disc pl-5 text-red-600">
            {missingVars.map((variable) => (
              <li key={variable} className="text-sm font-mono my-1">{variable}</li>
            ))}
          </ul>
        </div>
        
        <div className="text-sm text-gray-600 mb-6">
          <p className="mb-2 font-semibold">Steps to resolve:</p>
          <ol className="list-decimal pl-5 text-left">
            <li className="mb-1">Check that you have correctly set up your <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file.</li>
            <li className="mb-1">Verify that you have obtained the necessary API keys from the respective services.</li>
            <li className="mb-1">Restart your development server after updating environment variables.</li>
            <li>If deploying to production, ensure environment variables are configured in your hosting provider.</li>
          </ol>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            Retry Connection
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-6">
        This message is only visible to administrators and developers.
      </p>
    </div>
  );
} 