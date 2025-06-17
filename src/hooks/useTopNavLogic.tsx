
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useTopNavLogic = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserRoles();
    } else {
      setIsAdmin(false);
      setIsCreator(false);
      setProfileLoading(false);
    }
  }, [user]);

  const checkUserRoles = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    console.log('Checking user roles for user:', user.id);

    try {
      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('Error checking admin status:', adminError);
      }

      setIsAdmin(!!adminData);
      console.log('Admin status:', !!adminData);

      // Check if user is a creator by checking their profile account_type
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        setIsCreator(false);
      } else {
        const creatorStatus = profileData?.account_type === 'creator';
        setIsCreator(creatorStatus);
        console.log('Creator status:', creatorStatus, 'Account type:', profileData?.account_type);
      }
    } catch (error) {
      console.error('Error in checkUserRoles:', error);
      setIsAdmin(false);
      setIsCreator(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBecomeCreatorClick = () => {
    setShowOnboardingDialog(true);
    closeMobileMenu();
  };

  const handleSignInClick = () => {
    window.location.href = '/auth';
    closeMobileMenu();
  };

  return {
    user,
    signOut,
    isAdmin,
    isCreator,
    isMobileMenuOpen,
    showOnboardingDialog,
    profileLoading,
    toggleMobileMenu,
    closeMobileMenu,
    handleBecomeCreatorClick,
    handleSignInClick,
    setShowOnboardingDialog
  };
};
