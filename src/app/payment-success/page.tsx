"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Payment verification failed');
        }

        setSuccess(true);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
        
      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error instanceof Error ? error.message : 'Payment verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center">
              {/* Step 1 - Registration */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Registration</span>
              </div>
              
              {/* Horizontal Line */}
              <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
              
              {/* Step 2 - Choose plan */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Choose plan</span>
              </div>
              
              {/* Horizontal Line */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#FF5C8D] to-[#FFA600] mx-4"></div>
              
              {/* Step 3 - Pay */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium animate-pulse">
                  3
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500">Processing payment...</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#FF5C8D]" />
            <p className="text-lg">Verifying your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center">
              {/* Step 1 - Registration */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Registration</span>
              </div>
              
              {/* Horizontal Line */}
              <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
              
              {/* Step 2 - Choose plan */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Choose plan</span>
              </div>
              
              {/* Horizontal Line */}
              <div className="w-16 h-0.5 bg-red-300 mx-4"></div>
              
              {/* Step 3 - Pay */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  ❌
                </div>
                <span className="ml-3 text-sm font-medium text-red-600">Payment failed</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="text-red-500 text-6xl">❌</div>
            <h1 className="text-2xl font-bold text-red-600">Payment Verification Failed</h1>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push('/select-plan')} variant="outline">
              Back to Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center">
              {/* Step 1 - Registration */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Registration</span>
              </div>
              
              {/* Horizontal Line */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#FF5C8D] to-[#FFA600] mx-4"></div>
              
              {/* Step 2 - Choose plan */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Choose plan</span>
              </div>
              
              {/* Horizontal Line */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#FF5C8D] to-[#FFA600] mx-4"></div>
              
              {/* Step 3 - Pay */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-4 h-4" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Pay</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6 max-w-md mx-auto">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
            <div className="space-y-2">
              <p className="text-lg text-gray-700">Welcome to YTZA Pro! 🎉</p>
              <p className="text-gray-600">You now have 50 credits to create amazing thumbnails.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                Redirecting to your dashboard in a few seconds...
              </p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white border-2 border-black shadow-[4px_4px_0px_0px_#18181B] hover:shadow-[6px_6px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
            >
              Go to Dashboard Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function PaymentSuccessLoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-lg">Loading payment information...</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 