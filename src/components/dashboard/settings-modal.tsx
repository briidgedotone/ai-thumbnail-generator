"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Shield, Gem, CreditCard, CheckCircle, Calendar, ChevronRight, Lock, KeyRound, Mail, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from 'boring-avatars';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = "general" | "security" | "subscription";

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  
  // General tab states
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  
  // Security tab states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    console.log("Password change requested");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password changed successfully!");
  };

  const handleForgotPassword = () => {
    alert("Password reset instructions sent to your email address.");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="py-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Profile Information</h3>
            <p className="text-sm text-gray-500 mb-6">
              Update your name and email address.
            </p>
            
            <div className="mb-8 flex items-center">
              <div className="relative mr-6">
                <Avatar
                  size={80}
                  name="User SessionID"
                  variant="beam" 
                  colors={['#FF8C00', '#FFA500', '#FFD700', '#FF4500', '#FF6347']}
                />
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-xl font-bold text-gray-900">{name}</p>
                <p className="text-md text-gray-600">{email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-8">
              <Button className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-6 py-3 font-medium h-12 shadow-[2px_2px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                Save Changes
              </Button>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="py-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Security Settings</h3>
            <p className="text-sm text-gray-500 mb-6">
              Manage your password.
            </p>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current Password
                </label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors"
                  placeholder="Enter your current password"
                />
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password
                </label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors"
                  placeholder="Enter your new password"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors"
                  placeholder="Confirm your new password"
                />
              </div>
              
              {passwordError && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-sm text-red-700 flex items-start shadow-sm">
                  <CircleAlert size={18} className="mr-2 mt-0.5 flex-shrink-0 text-red-600" />
                  {passwordError}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3">
                <Button 
                  type="submit"
                  className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-6 py-3 font-medium h-12 shadow-[2px_2px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Update Password
                </Button>
                
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </div>
        );
      case "subscription":
        return (
          <div className="py-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Subscription Details</h3>
            <p className="text-sm text-gray-500 mb-6">
              View your current plan and manage your subscription.
            </p>
            
            <div className="p-5 bg-gradient-to-r from-[#FF5C8D]/10 via-[#FF0000]/10 to-[#FFA600]/10 rounded-xl border-2 border-[#FF5C8D]/30 mb-8 shadow-lg">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] p-3 rounded-xl mr-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                  <Gem size={22} className="text-white" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xl text-gray-900">Pro Plan</h4>
                  <p className="text-sm text-gray-600">Access to all premium features and 20 credits per month.</p>
                  
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 pt-0.5">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF5C8D]/20 via-[#FF0000]/20 to-[#FFA600]/20 text-sm font-semibold text-[#FF0000]">15/20 credits remaining</span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      Renews on July 15, 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-gray-300 rounded-xl flex items-center group cursor-pointer hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="p-2.5 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mr-4 text-white shadow-md">
                  <CreditCard size={18} />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800 text-md">Payment Method</h5>
                  <p className="text-sm text-gray-500">Visa ending in 4242</p>
                </div>
                <button className="ml-3 px-3.5 py-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 rounded-lg hover:bg-pink-50 transition-colors">
                  Update
                </button>
              </div>
              
              <div className="p-4 bg-white border-2 border-gray-300 rounded-xl flex items-center group cursor-pointer hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mr-4 text-white shadow-md">
                  <KeyRound size={18} />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800 text-md">Billing History</h5>
                  <p className="text-sm text-gray-500">View all previous invoices</p>
                </div>
                <button className="ml-3 px-3.5 py-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 rounded-lg hover:bg-pink-50 transition-colors">
                  View
                </button>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <Button className="w-full justify-between rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-6 py-3 font-medium h-12 shadow-[2px_2px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                <span>Upgrade Plan</span>
                <ChevronRight size={18} />
              </Button>
              
              <Button variant="outline" className="w-full rounded-lg border-2 border-red-400 text-red-600 px-6 py-3 font-medium h-12 hover:bg-red-50/70 hover:border-red-500 transition-colors shadow-sm hover:shadow-md">
                Cancel Subscription
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const buttonClasses = "flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none cursor-pointer";
  const activeButtonClasses = "border-b-2 border-pink-600 text-pink-600 font-semibold";
  const inactiveButtonClasses = "text-gray-500 hover:text-gray-800 hover:bg-gray-100/70 border-b-2 border-transparent";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 bg-white dark:bg-gray-950 rounded-xl border-2 border-gray-300 shadow-2xl dark:border-gray-700">
        <DialogHeader className="p-5 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Settings</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1 dark:text-gray-400">
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("general")}
            className={cn(buttonClasses, activeTab === "general" ? activeButtonClasses : inactiveButtonClasses)}
          >
            <User size={15} /> General
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={cn(buttonClasses, activeTab === "security" ? activeButtonClasses : inactiveButtonClasses)}
          >
            <Shield size={15} /> Security
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={cn(buttonClasses, activeTab === "subscription" ? activeButtonClasses : inactiveButtonClasses)}
          >
            <Gem size={15} /> Subscription
          </button>
        </div>

        <div className="px-5 max-h-[60vh] overflow-y-auto pb-6 dark:bg-gray-900">
         {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
} 