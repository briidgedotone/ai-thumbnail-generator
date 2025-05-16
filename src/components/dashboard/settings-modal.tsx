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
import { User, Shield, Gem, CreditCard, CheckCircle, Calendar, ChevronRight, Lock, KeyRound, Mail, CircleAlert, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from 'boring-avatars';
import { createSupabaseClient } from "@/lib/supabase/client";
import { Toaster, toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string | null;
  userEmail: string | null;
  avatarName: string;
}

type SettingsTab = "general" | "security" | "subscription";

export function SettingsModal({ 
  isOpen, 
  onClose, 
  userName: initialUserName,
  userEmail: initialUserEmail,
  avatarName 
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  
  const [nameInput, setNameInput] = useState(initialUserName || "");
  const [emailInput, setEmailInput] = useState(initialUserEmail || "");

  // New states for save operation
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createSupabaseClient();

  React.useEffect(() => {
    if (isOpen) {
      setNameInput(initialUserName || "");
      setEmailInput(initialUserEmail || "");
    }
  }, [initialUserName, initialUserEmail, isOpen]);
  
  // Security tab states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setIsUpdatingPassword(true);

    if (!currentPassword) {
      setPasswordError("Current password is required");
      setIsUpdatingPassword(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      setIsUpdatingPassword(false);
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setIsUpdatingPassword(false);
      return;
    }

    const { data: { user }, error: getUserError } = await supabase.auth.getUser();

    if (getUserError || !user || !user.email) {
      setPasswordError("Could not verify user. Please try again or re-login.");
      toast.error("Error fetching user details. Please re-login and try again.");
      setIsUpdatingPassword(false);
      return;
    }

    // Step 1: Verify current password by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email, 
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError("Incorrect current password. Please try again.");
      toast.error("Incorrect current password.");
      setIsUpdatingPassword(false);
      return;
    }

    // Step 2: If current password is correct, update to the new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error("Password update error:", updateError);
      if (updateError.message.includes("requires a recent login")) {
        setPasswordError("Changing password requires a recent login. Please log out and log back in to continue.");
        toast.error("Security check: Please log out and log back in to change your password.");
      } else if (updateError.message.toLowerCase().includes("weak password")) {
        setPasswordError("New password is too weak. Please choose a stronger password.");
        toast.error("New password is too weak. Please choose something stronger.");
      } else {
        setPasswordError(`Failed to update password. ${updateError.message}`);
        toast.error(`Failed to update password: ${updateError.message}`);
      }
    } else {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsUpdatingPassword(false);
  };

  const handleForgotPassword = () => {
    alert("Password reset instructions sent to your email address.");
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    let nameUpdateSuccess = false;
    let emailUpdateAttempted = false;
    let emailUpdateRequiresConfirmation = false;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Could not identify user. Please log in again.");
      setIsSaving(false);
      return;
    }

    let accumulatedErrors: string[] = [];
    let accumulatedSuccessMessages: string[] = [];

    if (nameInput.trim() !== (initialUserName || "")) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: nameInput.trim() })
        .eq('id', user.id);
      if (profileError) {
        accumulatedErrors.push(`Failed to update name: ${profileError.message}`);
      } else {
        nameUpdateSuccess = true;
        accumulatedSuccessMessages.push("Name updated successfully.");
      }
    }

    if (emailInput.trim() !== (initialUserEmail || "")) {
      emailUpdateAttempted = true;
      const { error: emailError } = await supabase.auth.updateUser({
        email: emailInput.trim()
      });
      if (emailError) {
        accumulatedErrors.push(`Failed to update email: ${emailError.message}`);
      } else {
        emailUpdateRequiresConfirmation = true;
        accumulatedSuccessMessages.push("Confirmation email sent to verify your new email address.");
      }
    }

    if (accumulatedErrors.length > 0) {
      toast.error(accumulatedErrors.join("\n"));
    }
    
    if (accumulatedSuccessMessages.length > 0 && accumulatedErrors.length === 0) {
      toast.success(accumulatedSuccessMessages.join(" "));
    } else if (accumulatedSuccessMessages.length > 0 && accumulatedErrors.length > 0) {
      toast.info(`Partial success: ${accumulatedSuccessMessages.join(" ")} (but some errors occurred)`);
    }
    
    if (!nameUpdateSuccess && !emailUpdateAttempted && !emailUpdateRequiresConfirmation && accumulatedErrors.length === 0 && accumulatedSuccessMessages.length === 0) {
       if (nameInput.trim() === (initialUserName || "") && emailInput.trim() === (initialUserEmail || "")) {
        toast.info("No changes detected.");
      }
    }
    setIsSaving(false);
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
                  name={avatarName}
                  variant="beam" 
                  colors={['#FF8C00', '#FFA500', '#FFD700', '#FF4500', '#FF6347']}
                />
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-xl font-bold text-gray-900">{initialUserName || "User Name"}</p>
                <p className="text-md text-gray-600">{initialUserEmail || "user@example.com"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <Input 
                  id="name" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors placeholder:text-gray-400"
                  placeholder={"Username"}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  value={emailInput} 
                  onChange={(e) => setEmailInput(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors placeholder:text-gray-400"
                  placeholder={"user@example.com"}
                />
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-6 py-3 font-medium h-12 shadow-[2px_2px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px] flex items-center justify-center w-full sm:w-auto"
              >
                {isSaving ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
                ) : (
                  "Save Changes"
                )}
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
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 pr-10 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors placeholder:text-gray-400"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-pink-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 pr-10 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors placeholder:text-gray-400"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-pink-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full border-2 border-gray-300 rounded-xl h-12 px-4 pr-10 focus:border-pink-500 focus:ring-pink-500 shadow-sm transition-colors placeholder:text-gray-400"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-pink-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                  disabled={isUpdatingPassword}
                  className="rounded-lg border-2 border-black bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] text-white px-6 py-3 font-medium h-12 shadow-[2px_2px_0px_0px_#18181B] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#18181B] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  {isUpdatingPassword ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...</>
                  ) : (
                    "Update Password"
                  )}
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