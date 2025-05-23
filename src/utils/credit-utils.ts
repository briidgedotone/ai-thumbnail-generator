import { createSupabaseClient } from '@/lib/supabase/client';

/**
 * Check if user has sufficient credits for generation
 * @returns Promise<{hasCredits: boolean, currentCredits: number}>
 */
export const checkUserCredits = async (): Promise<{hasCredits: boolean, currentCredits: number}> => {
  try {
    const supabase = createSupabaseClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (creditsError) {
      console.error('Error fetching user credits:', creditsError);
      return { hasCredits: false, currentCredits: 0 };
    }

    const currentCredits = creditsData?.balance || 0;
    return { 
      hasCredits: currentCredits >= 1, 
      currentCredits 
    };
  } catch (error) {
    console.error('Error checking user credits:', error);
    return { hasCredits: false, currentCredits: 0 };
  }
};

/**
 * Get current user credits and subscription tier
 * @returns Promise<{currentCredits: number, tier: string}>
 */
export const getUserCreditsInfo = async (): Promise<{currentCredits: number, tier: string}> => {
  try {
    const supabase = createSupabaseClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('balance, subscription_tier')
      .eq('user_id', user.id)
      .single();

    if (creditsError) {
      console.error('Error fetching user credits:', creditsError);
      return { currentCredits: 0, tier: 'free' };
    }

    return { 
      currentCredits: creditsData?.balance || 0,
      tier: creditsData?.subscription_tier || 'free'
    };
  } catch (error) {
    console.error('Error fetching user credits info:', error);
    return { currentCredits: 0, tier: 'free' };
  }
}; 