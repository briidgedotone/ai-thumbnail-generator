"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const oauthErrorDescription = searchParams.get('error_description');
    if (oauthErrorDescription) {
      setError(oauthErrorDescription);
    }
  }, [searchParams, router]);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleAuthAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (isLoginView) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/dashboard");
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

const handleGoogleSignIn = async () => {
  setLoading(true);
  setError(null);
  const { error: googleSignInError } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
     redirectTo: new URL('/auth/callback', window.location.origin).toString(),
    },
  });

  if (googleSignInError) {
    setError(googleSignInError.message);
    setLoading(false);
   return;
  }
 // User will be redirected to Google OAuth page, so we don't need to handle navigation here
};

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 lg:p-16 justify-between">
        {/* Header Nav */}
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/ytza-logo.png" alt="YTZA Logo" width={140} height={44} className="object-contain" />
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-neutral-700">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Button
              onClick={toggleView}
              variant="outline"
              className="rounded-lg border-2 border-black bg-white hover:bg-gray-100 text-black px-5 text-sm font-medium shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] h-10"
              disabled={loading}
            >
              {isLoginView ? "Sign Up" : "Log In"}
            </Button>
          </div>
        </header>

        {/* Form Area */}
        <main className="flex-grow flex flex-col justify-center py-12">
          <div className="w-full max-w-sm mx-auto">
            {isLoginView ? (
              <>
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
                <p className="text-neutral-600 mb-8">
                  Sign in to generate your next viral thumbnail!
                </p>
                <form onSubmit={handleAuthAction} className="space-y-6">
                  <div>
                    <label htmlFor="emailLogin" className="block text-xs font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="emailLogin"
                      name="emailLogin"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border-2 border-neutral-300 focus:border-black focus:ring-2 focus:ring-[#FF5C8D]/50 h-10 px-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="passwordLogin" className="block text-xs font-medium text-neutral-700 mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      id="passwordLogin"
                      name="passwordLogin"
                      placeholder="••••••••"
                      className="w-full rounded-lg border-2 border-neutral-300 focus:border-black focus:ring-2 focus:ring-[#FF5C8D]/50 h-10 px-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        className="h-4 w-4 text-[#FF0000] border-neutral-300 rounded focus:ring-[#FF5C8D]/50 custom-checkbox"
                        disabled={loading}
                      />
                      <label htmlFor="rememberMe" className="ml-2 block text-sm text-neutral-700">
                        Remember me
                      </label>
                    </div>
                    <Link href="#" className="text-sm font-medium text-[#FF0000] hover:text-[#FF5C8D]">
                      Forgot Password?
                    </Link>
                  </div>
                  {error && (
                    <p className="text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-5 text-base font-medium shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] h-10 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Log In"}
                    {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>

                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-neutral-300"></div>
                  <span className="mx-4 text-sm text-neutral-500">OR</span>
                  <div className="flex-grow border-t border-neutral-300"></div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-lg border-2 border-black bg-white text-black px-5 text-base font-medium shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] h-10 flex items-center justify-center"
                  disabled={loading}
                  onClick={handleGoogleSignIn}
                >
                  <span className="mr-2 font-bold">G</span> Login with Google
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">Create Account</h1>
                <p className="text-neutral-600 mb-8">
                  Join us and start creating stunning thumbnails in seconds!
                </p>
                <form onSubmit={handleAuthAction} className="space-y-6">
                  <div>
                    <label htmlFor="fullNameSignup" className="block text-xs font-medium text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      id="fullNameSignup"
                      name="fullNameSignup"
                      placeholder="Your Name"
                      className="w-full rounded-lg border-2 border-neutral-300 focus:border-black focus:ring-2 focus:ring-[#FF5C8D]/50 h-10 px-3"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="emailSignup" className="block text-xs font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="emailSignup"
                      name="emailSignup"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border-2 border-neutral-300 focus:border-black focus:ring-2 focus:ring-[#FF5C8D]/50 h-10 px-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="passwordSignup" className="block text-xs font-medium text-neutral-700 mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      id="passwordSignup"
                      name="passwordSignup"
                      placeholder="Create a strong password"
                      className="w-full rounded-lg border-2 border-neutral-300 focus:border-black focus:ring-2 focus:ring-[#FF5C8D]/50 h-10 px-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-5 text-base font-medium shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] h-10 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign Up"}
                    {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>

                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-neutral-300"></div>
                  <span className="mx-4 text-sm text-neutral-500">OR</span>
                  <div className="flex-grow border-t border-neutral-300"></div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-lg border-2 border-black bg-white text-black px-5 text-base font-medium shadow-[3px_3px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[5px_5px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] h-10 flex items-center justify-center"
                  disabled={loading}
                  onClick={handleGoogleSignIn}
                >
                  <span className="mr-2 font-bold">G</span> Sign up with Google
                </Button>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs text-neutral-500 mt-2">
            ©{new Date().getFullYear()} ThumbnailBeast. All Rights Reserved.
          </p>
        </footer>
      </div>

      {/* Right Column (Image Placeholder) */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600]">
        {/* Placeholder for image - could add an <Image /> component here if needed */}
      </div>

      {/* Basic style for custom checkbox to mimic the theme colors */}
      <style jsx global>{`
        .custom-checkbox:checked {
          background-color: #FF0000;
          border-color: #FF0000;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
        .custom-checkbox:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
          --tw-ring-color: rgba(255, 92, 141, 0.5);
          border-color: #FF0000;
        }
      `}</style>
    </div>
  );
} 