"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming you have a Label component, or I'll use HTML label
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react"; // ShieldCheck for a generic logo icon for now

export default function AuthPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 lg:p-16 justify-between">
        {/* Header Nav */}
        <header className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-neutral-900 flex items-center">
            {/* Replace with actual logo if available */}
            {/* <ShieldCheck className="h-8 w-8 mr-2 text-[#FF0000]" />  */}
            LOGO
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-neutral-700">Are you a new customer?</span>
            <Button
              variant="outline" // Or your default gradient style if preferred
              className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-5 py-2 text-sm font-medium shadow-[3px_3px_0px_0px_#18181B]"
            >
              Enroll Now
            </Button>
          </div>
        </header>

        {/* Form Area */}
        <main className="flex-grow flex flex-col justify-center py-12">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
            <p className="text-neutral-600 mb-8">
              Sign in to your Regions MyMortgage account. {/* Update text if needed */}
            </p>

            <form className="space-y-6">
              <div>
                {/* Using HTML label if @/components/ui/label is not set up for this exact style */}
                <label htmlFor="onlineId" className="block text-xs font-medium text-neutral-700 mb-1">
                  Online ID
                </label>
                <Input
                  type="text"
                  id="onlineId"
                  name="onlineId"
                  defaultValue="Geoffrey Mott" // As per image
                  className="w-full rounded-lg border-neutral-300 focus:border-[#FF0000] focus:ring-[#FF0000]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  defaultValue="............" // As per image
                  className="w-full rounded-lg border-green-500 focus:border-green-600 focus:ring-green-600" // Green border as per image focus
                />
              </div>

              <div className="flex items-center">
                {/* Create Checkbox component or use basic HTML checkbox */}
                {/* <Checkbox id="rememberMe" name="rememberMe" defaultChecked className="h-4 w-4 text-green-600 border-neutral-300 rounded focus:ring-green-500" /> */}
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  name="rememberMe" 
                  defaultChecked 
                  className="h-4 w-4 text-green-600 border-neutral-300 rounded focus:ring-green-500 custom-checkbox"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-5 py-3 text-base font-medium shadow-[3px_3px_0px_0px_#18181B]"
              >
                Login
              </Button>

              <div className="flex items-center justify-center space-x-4 text-sm">
                <Link href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot Online ID?
                </Link>
                <span className="text-neutral-400">·</span>
                <Link href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <div className="text-xs text-neutral-500 space-x-3">
            <span><ShieldCheck className="inline h-3 w-3 mr-1" />Equal Housing Lender</span>
            <span>·</span>
            <span>Member FDIC</span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            ©{new Date().getFullYear()} Regions Financial Corporation. All Rights Reserved. · 1 (800) REGIONS
          </p>
        </footer>
      </div>

      {/* Right Column (Image Placeholder) */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600]">
        {/* Placeholder for image - could add an <Image /> component here if needed */}
      </div>

      {/* Basic style for custom checkbox to mimic the green check */}
      <style jsx global>{`
        .custom-checkbox:checked {
          background-color: #16a34a; /* Tailwind green-600 */
          border-color: #16a34a;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
        .custom-checkbox:focus {
          ring: 2px;
          ring-color: #22c55e; /* Tailwind green-500 */
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
} 