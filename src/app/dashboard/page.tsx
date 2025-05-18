"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
// import { ChatInput } from "@/components/ui/chat-input"; // No longer needed directly here
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles as GenerateIcon, UploadCloud as UploadIcon, Palette, LayoutGrid, LogOut, SettingsIcon, Loader2 } from "lucide-react";
import Avatar from 'boring-avatars'; // Added import for Boring Avatars
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { ProjectsView } from "@/components/dashboard/projects-view";
import { StudioView } from "@/components/dashboard/studio-view"; // Import the new StudioView component
import { motion, AnimatePresence } from "framer-motion"; // Ensure framer-motion is imported
import { SettingsModal } from "@/components/dashboard/settings-modal"; // Import the new SettingsModal component
import Image from "next/image"; // Import Next.js Image component
import Link from "next/link"; // Import Next.js Link component
import { createSupabaseClient } from "@/lib/supabase/client"; // Import Supabase client
import { useRouter } from "next/navigation"; // Import useRouter for redirects

// New CircularProgress component
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  baseColor?: string;
  // progressColor prop is no longer used directly for the gradient version, but kept for API consistency if needed elsewhere
  progressColor?: string; 
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 36,
  strokeWidth = 4,
  baseColor = "text-gray-300",
  // progressColor is destructured but not applied to the gradient circle
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const gradientId = "creditGradient";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 transform">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#FF5C8D', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#FF0000', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#FFA600', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <circle
        className={baseColor} // Base circle still uses Tailwind color class
        strokeWidth={strokeWidth}
        stroke="currentColor" // Takes color from the baseColor Tailwind class
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        // className={progressColor} // Removed Tailwind class for progress color
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke={`url(#${gradientId})`} // Apply SVG gradient by ID
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: "stroke-dashoffset 0.35s ease-out" }}
      />
    </svg>
  );
};

export default function DashboardPage() {
  // const [chatInputValue, setChatInputValue] = useState(""); // Removed state for old input
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedThumbnailStyle, setSelectedThumbnailStyle] = useState<string | null>(null);
  // const descriptionTextareaRef = useTextareaResize(videoDescription, 2); // This is now inside VideoDescriptionInput

  // New state for video details panel
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Dummy credit state
  const [currentCredits, setCurrentCredits] = useState(15);
  const [totalCredits, setTotalCredits] = useState(20);
  const [activeView, setActiveView] = useState<'studio' | 'projects'>('studio'); // New state for active view
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // New state for profile dropdown
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // New state for settings modal

  // New state for user information
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState<string>("User"); // For boring-avatars, default
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Still true by default for initial load

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createSupabaseClient();
  const router = useRouter();
  const isMounted = useRef(false); // To track if component has mounted

  // handleChatSubmit is removed as the new component handles its own submission/logic.

  const handleGenerate = () => {
    // Temporarily remove chatInputValue check. We will need to find a way to get this value from AIChatInput if it moves out of StudioView.
    if (/*!chatInputValue.trim() ||*/ !videoDescription.trim() || !selectedThumbnailStyle) {
      console.log("Cannot generate, inputs or style selection missing");
      if (!videoDescription.trim()) {
        alert("Please describe your video.");
      }
      if (!selectedThumbnailStyle) {
        alert("Please select a thumbnail style before generating.");
      }
      return;
    }
    console.log("Generating thumbnails with:");
    console.log("Video Description:", videoDescription);
    console.log("Selected Style:", selectedThumbnailStyle);
    // AIChatInput state might need to be accessed here if it's not self-contained for generation logic
  };

  const handleUploadStyle = () => {
    console.log("Upload your style button clicked");
  };

  // Temporarily remove chatInputValue from canGenerate logic
  const canGenerate = /*chatInputValue.trim() !== "" &&*/ videoDescription.trim() !== "" && selectedThumbnailStyle !== null;

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(prev => !prev);
  };

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
    setIsProfileDropdownOpen(false); // Close dropdown when opening modal
    // console.log("Open settings modal clicked"); // Already logs when button is clicked
  };

  const handleCloseSettings = () => {
    setIsSettingsModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will handle the redirect to /auth and state cleanup
    setIsProfileDropdownOpen(false); 
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef]);

  // New handler to switch from Projects to Studio view
  const handleCreateNew = () => {
    setActiveView('studio');
    console.log("Switching to Studio view to create new thumbnail");
  };

  const creditPercentage = totalCredits > 0 ? (currentCredits / totalCredits) * 100 : 0;

  useEffect(() => {
    isMounted.current = true; // Set to true on mount

    const fetchUserData = async (isBackgroundRefresh = false) => {
      // Only show full page loader on initial load, not on background refreshes
      if (!isBackgroundRefresh && isMounted.current) {
        setIsLoadingUser(true);
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user or no user session:", userError?.message);
        if (isMounted.current) { // Prevent state updates if unmounted
          router.push('/auth');
        }
        return;
      }

      // Proceed with setting user data only if component is still mounted
      if (!isMounted.current) return;

      setUserEmail(user.email || "No email found");
      setAvatarName(user.email || user.id);

      if (user.id) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (!isMounted.current) return; // Check again before setting state

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError.message);
          setUserName(user.email?.split('@')[0] || "User");
        } else if (profile && profile.full_name) {
          setUserName(profile.full_name);
        } else {
          setUserName(user.email?.split('@')[0] || "User");
        }
      } else {
        setUserName(user.email?.split('@')[0] || "User");
      }
      
      if (isMounted.current) {
        setIsLoadingUser(false); // Stop loading indicator
      }
    };

    // Initial fetch
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted.current) return; // Don't do anything if component unmounted

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // For these events, treat as a background refresh if user data already exists
        fetchUserData(!!userEmail); // Pass true if userEmail exists, indicating a background refresh
      } else if (event === 'SIGNED_OUT') {
        setUserName(null);
        setUserEmail(null);
        setAvatarName("User");
        router.push('/auth');
      }
    });

    return () => {
      isMounted.current = false; // Set to false on unmount
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router, userEmail]); // Added userEmail to dependencies to control isBackgroundRefresh correctly

  // Handler for details panel visibility state change from StudioView
  const handleDetailsPanelVisibilityChange = useCallback((isOpen: boolean) => {
    console.log("[DashboardPage] handleDetailsPanelVisibilityChange called. isOpen:", isOpen);
    setIsDetailsPanelOpen(isOpen);
  }, []); // Empty dependency array means this function is stable

  // Handler to reset inputs for a new generation, called by StudioView
  const handlePrepareNewGeneration = useCallback(() => {
    console.log("[DashboardPage] handlePrepareNewGeneration called, clearing videoDescription.");
    setVideoDescription("");
    // We decided to keep the style selected, so setSelectedThumbnailStyle(null) remains commented out.
    // If you want to reset the style as well, uncomment the line below:
    // setSelectedThumbnailStyle(null);
  }, []); // Empty dependency array

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background grainy-background text-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-[#FF0000] mb-4" /> 
        <p className="text-lg font-medium">Loading Dashboard...</p>
        <p className="text-sm text-gray-500">Please wait a moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative grainy-background dashboard-backdrop-circle-container flex flex-col items-center justify-center px-4 pt-24 pb-8">
      {/* Top Left Fixed Element: Logo */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/ytza-logo.png" alt="YTZA Logo" width={120} height={38} className="object-contain" />
        </Link>
      </div>

      {/* Top Center Fixed Elements: Studio/Projects Button Group */}
      <AnimatePresence mode="wait">
        {!isDetailsPanelOpen && (
          <motion.div 
            key="studio-projects-switcher"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 25,
              duration: 0.3
            }}
          >
            <div className="relative flex items-center gap-1 p-1 h-11 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-300">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors duration-200 ease-in-out z-20 cursor-pointer",
                  activeView !== 'studio' && "hover:bg-gray-200/70"
                )}
                onClick={() => {
                  setActiveView('studio');
                  console.log("Studio view selected");
                }}
              >
                {activeView === 'studio' && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] shadow-md z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={cn(
                  "relative z-30 flex items-center gap-2",
                  activeView === 'studio' ? "text-white" : "text-gray-600 hover:text-gray-800" 
                )}>
                  <Palette size={16} /> Studio
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors duration-200 ease-in-out z-20 cursor-pointer",
                  activeView !== 'projects' && "hover:bg-gray-200/70"
                )}
                onClick={() => {
                  setActiveView('projects');
                  console.log("Projects view selected");
                }}
              >
                {activeView === 'projects' && (
                  <motion.div
                    layoutId="activePill" 
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF5C8D] via-[#FF0000] to-[#FFA600] shadow-md z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={cn(
                  "relative z-30 flex items-center gap-2",
                  activeView === 'projects' ? "text-white" : "text-gray-600 hover:text-gray-800" 
                )}>
                  <LayoutGrid size={16} /> Projects
                </span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Right Fixed Elements: Credits & Profile */}
      <AnimatePresence mode="wait">
        {!isDetailsPanelOpen && (
          <motion.div 
            className="fixed top-6 right-6 z-50 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              type: "spring",
              stiffness: 250,
              damping: 25,
              duration: 0.4,
              delay: isDetailsPanelOpen ? 0 : 0.1 // Small delay when reappearing
            }}
          >
            {/* Credit Counter Element - Changed to pill shape with text, and set to 44px height */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 h-11 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-300"
              title={`${currentCredits}/${totalCredits} Credits Remaining`}
            >
              <CircularProgress percentage={creditPercentage} size={20} strokeWidth={2.5} baseColor="text-gray-200" /> 
              <span className="text-xs font-medium text-gray-700">
                {currentCredits}/{totalCredits} Credits
              </span>
            </div>
            {/* Profile Element - Button removed, div styled to look like bordered avatar */}
            <div className="relative">
              <div 
                className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-400 hover:border-gray-500 transition-all p-0 overflow-hidden cursor-pointer flex items-center justify-center"
                onClick={handleProfileClick}
                title="Profile"
              >
                <Avatar
                  size={44}
                  name={avatarName}
                  variant="beam" 
                  colors={['#FF8C00', '#FFA500', '#FFD700', '#FF4500', '#FF6347']} 
                />
              </div>
              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <motion.div
                  ref={profileDropdownRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 origin-top-right bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/70 focus:outline-none z-50 py-1"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userName || "User Name"} {/* Display fetched user name */}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userEmail || "user@example.com"} {/* Display fetched user email */}
                    </p>
                  </div>
                  <div className="h-px bg-gray-200/70 my-1"></div>
                  <button
                    onClick={handleOpenSettings}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100/70 hover:text-gray-900 transition-colors duration-150"
                  >
                    <SettingsIcon size={16} className="mr-2.5 text-gray-500" />
                    Settings
                  </button>
                  <div className="h-px bg-gray-200/70 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100/70 hover:text-gray-900 transition-colors duration-150"
                  >
                    <LogOut size={16} className="mr-2.5 text-gray-500" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Content Area */}
      <div className={cn(
        "max-w-3xl w-full flex flex-col items-stretch",
        "transition-[margin-right] duration-400 ease-in-out",
        isDetailsPanelOpen ? "mr-[450px]" : "mr-0"
      )}>
        {activeView === 'studio' ? (
          <StudioView 
            selectedThumbnailStyle={selectedThumbnailStyle}
            onSelectStyle={setSelectedThumbnailStyle}
            videoDescription={videoDescription}
            onVideoDescriptionChange={setVideoDescription}
            onDetailsPanelStateChange={handleDetailsPanelVisibilityChange}
            onPrepareNewGeneration={handlePrepareNewGeneration}
          />
        ) : (
          <ProjectsView onCreateNew={handleCreateNew} />
        )}
      </div>

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettings}
        userName={userName}
        userEmail={userEmail}
        avatarName={avatarName}
      />
    </div>
  );
} 