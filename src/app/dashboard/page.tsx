"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
// import { ChatInput } from "@/components/ui/chat-input"; // No longer needed directly here
import { Button } from "@/components/ui/button";
import { Palette, LayoutGrid, LogOut, SettingsIcon, Loader2 } from "lucide-react";
import Avatar from 'boring-avatars'; // Added import for Boring Avatars
import { cn } from "@/lib/utils";
import { ProjectsView } from "@/components/dashboard/projects-view";
import { StudioView } from "@/components/dashboard/studio-view"; // Import the new StudioView component
import { motion, AnimatePresence } from "framer-motion"; // Ensure framer-motion is imported
import { SettingsModal } from "@/components/dashboard/settings-modal"; // Import the new SettingsModal component
import Image from "next/image"; // Import Next.js Image component
import Link from "next/link"; // Import Next.js Link component
import { createSupabaseClient } from "@/lib/supabase/client"; // Import Supabase client
import { useRouter } from "next/navigation"; // Import useRouter for redirects
import { ProjectInfoPanel } from "@/components/dashboard/ProjectInfoPanel"; // Import the new panel
import { InsufficientCreditsModal } from "@/components/ui/insufficient-credits-modal"; // Import the new modal

// Define Project type locally (as defined in ProjectInfoPanel and used for state)
interface Project {
  id: string;
  title: string;
  thumbnailUrl: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  user_id?: string; // Added to match state, ensure it exists if needed by panel
  updatedAt?: string;
  selected_style_id?: string;
}

export default function DashboardPage() {
  // const [chatInputValue, setChatInputValue] = useState(""); // Removed state for old input
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedThumbnailStyle, setSelectedThumbnailStyle] = useState<string | null>(null);
  // const descriptionTextareaRef = useTextareaResize(videoDescription, 2); // This is now inside VideoDescriptionInput

  // New state for video details panel
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Dummy credit state
  const [currentCredits, setCurrentCredits] = useState(15);
  const [userTier, setUserTier] = useState<string>('free'); // Remove totalCredits state
  const [activeView, setActiveView] = useState<'studio' | 'projects'>('studio'); // New state for active view
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // New state for profile dropdown
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // New state for settings modal

  // New state for user information
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState<string>("User"); // For boring-avatars, default
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Still true by default for initial load

  // State for the project info panel
  const [projectToView, setProjectToView] = useState<Project | null>(null);
  const [isProjectInfoPanelOpen, setIsProjectInfoPanelOpen] = useState(false);

  // New state for insufficient credits modal
  const [isInsufficientCreditsModalOpen, setIsInsufficientCreditsModalOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createSupabaseClient();
  const router = useRouter();
  const isMounted = useRef(false); // To track if component has mounted

  // handleChatSubmit is removed as the new component handles its own submission/logic.

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(prev => !prev);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
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
  };

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

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
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

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Error fetching user: " + userError?.message);
        }

        const { data: creditsData, error: creditsError } = await supabase
          .from('user_credits')
          .select('balance, subscription_tier')
          .eq('user_id', user.id)
          .single();

        if (creditsError) {
          throw new Error("Error fetching credits: " + creditsError.message);
        }

        if (creditsData) {
          setCurrentCredits(creditsData.balance);
          
          // Set user tier state (removed totalCredits logic)
          const tier = creditsData.subscription_tier?.toLowerCase();
          setUserTier(tier || 'free');
        }
      } catch (err) {
        console.error("Error fetching user credits:", err);
        setCurrentCredits(0); // Default to 0 on error
      }
    };

    fetchUserCredits();
  }, [supabase]);

  // Function to refresh credits after generation
  const refreshUserCredits = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (!creditsError && creditsData) {
        setCurrentCredits(creditsData.balance);
      }
    } catch (err) {
      console.error("Error refreshing user credits:", err);
    }
  }, [supabase]);

  // Handler for details panel visibility state change from StudioView
  const handleDetailsPanelVisibilityChange = useCallback((isOpen: boolean) => {
    setIsDetailsPanelOpen(isOpen);
  }, []); // Empty dependency array means this function is stable

  // Handler to reset inputs for a new generation, called by StudioView
  const handlePrepareNewGeneration = useCallback(() => {
    setVideoDescription("");
    // We decided to keep the style selected, so setSelectedThumbnailStyle(null) remains commented out.
    // If you want to reset the style as well, uncomment the line below:
    // setSelectedThumbnailStyle(null);
  }, []); // Empty dependency array

  // Handler to open the project info panel
  const handleOpenProjectInfoPanel = useCallback((project: Project) => {
    setProjectToView(project);
    setIsProjectInfoPanelOpen(true);
  }, []);

  // Handler to close the project info panel
  const handleCloseProjectInfoPanel = useCallback(() => {
    setIsProjectInfoPanelOpen(false);
    // Delay clearing projectToView to allow for panel exit animation
    // The ProjectInfoPanel itself handles not rendering if project is null during animation
  }, []);

  // Handler for insufficient credits
  const handleInsufficientCredits = useCallback(() => {
    setIsInsufficientCreditsModalOpen(true);
  }, []);

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
          <Image src="/ytza-logo.png" alt="YTZA Logo" width={120} height={38} className="object-contain" style={{ width: "auto", height: "auto" }} priority />
        </Link>
      </div>

      {/* Top Center Fixed Elements: Studio/Projects Button Group */}
      <AnimatePresence mode="wait">
        {!isDetailsPanelOpen && !isProjectInfoPanelOpen && (
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
        {!isDetailsPanelOpen && !isProjectInfoPanelOpen && (
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
              delay: (isDetailsPanelOpen || isProjectInfoPanelOpen) ? 0 : 0.1 // Small delay when reappearing
            }}
          >
            {/* Credit Counter Element - Simple credit display without progress */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 h-11 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-300"
              title={`${currentCredits} Credits Available`}
            >
              <span className="text-xs font-medium text-gray-700">
                {currentCredits} Credits
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
                    onClick={handleOpenSettingsModal}
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
        (isDetailsPanelOpen || isProjectInfoPanelOpen) ? "mr-[450px]" : "mr-0"
      )}>
        {activeView === 'studio' ? (
          <StudioView 
            selectedThumbnailStyle={selectedThumbnailStyle}
            onSelectStyle={setSelectedThumbnailStyle}
            videoDescription={videoDescription}
            onVideoDescriptionChange={setVideoDescription}
            onDetailsPanelStateChange={handleDetailsPanelVisibilityChange}
            onPrepareNewGeneration={handlePrepareNewGeneration}
            onInsufficientCredits={handleInsufficientCredits}
            onCreditsUsed={refreshUserCredits}
          />
        ) : (
          <ProjectsView 
            onCreateNew={handleCreateNew} 
            onProjectClick={handleOpenProjectInfoPanel}
          />
        )}
      </div>

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettings}
        userName={userName}
        userEmail={userEmail}
        avatarName={avatarName}
        userTier={userTier}
        currentCredits={currentCredits}
      />

      {/* Render ProjectInfoPanel */}
      <ProjectInfoPanel 
        project={projectToView} 
        isOpen={isProjectInfoPanelOpen} 
        onClose={handleCloseProjectInfoPanel} 
      />

      <InsufficientCreditsModal 
        isOpen={isInsufficientCreditsModalOpen}
        onClose={() => setIsInsufficientCreditsModalOpen(false)}
        currentCredits={currentCredits}
        userTier={userTier}
      />
    </div>
  );
} 