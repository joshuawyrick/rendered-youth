
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Don't update state if we're in the middle of signing out
        if (signingOut && event === 'SIGNED_IN') {
          console.log('Ignoring sign in event during sign out process');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      if (!signingOut) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [signingOut]);

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      setSigningOut(true);
      
      // Clear local state first
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
      
      // Wait a moment to ensure the sign out is processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to login page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      // Clear local state and redirect anyway
      setUser(null);
      setSession(null);
      window.location.href = '/auth';
    } finally {
      setSigningOut(false);
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
};
