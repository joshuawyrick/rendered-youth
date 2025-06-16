
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          // Ensure we clear everything on sign out
          setSession(null);
          setUser(null);
          setLoading(false);
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
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      // Clear the session from localStorage manually
      localStorage.removeItem('sb-rneamwxblioxlhisxaxr-auth-token');
      
      // Sign out from Supabase with proper scope
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
      
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      // Always redirect regardless of errors
      window.location.href = '/auth';
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
};
