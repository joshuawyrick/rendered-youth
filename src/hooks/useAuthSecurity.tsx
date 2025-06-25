import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { logSecurityEvent } from '@/services/securityService';

export const useAuthSecurity = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener with security logging
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Log authentication events for security monitoring
        if (event === 'SIGNED_IN' && session?.user) {
          await logSecurityEvent({
            action: 'USER_SIGNED_IN',
            resource_type: 'auth',
            resource_id: session.user.id,
            metadata: { email: session.user.email }
          });
        }
        
        if (event === 'SIGNED_OUT') {
          await logSecurityEvent({
            action: 'USER_SIGNED_OUT',
            resource_type: 'auth'
          });
          
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
      if (!mounted) return;
      
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logSecurityEventWrapper = async (action: string, metadata: Record<string, any>) => {
    await logSecurityEvent({
      action,
      resource_type: 'auth',
      metadata
    });
  };

  const checkRateLimit = async (action: string, identifier?: string): Promise<boolean> => {
    // Simple rate limiting implementation
    const key = `${action}_${identifier || 'anonymous'}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;

    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);

    if (validAttempts.length >= maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(validAttempts));
    return true;
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      
      // Log security event before sign out
      await logSecurityEvent({
        action: 'USER_SIGN_OUT_INITIATED',
        resource_type: 'auth'
      });
      
      // Clean local state first
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase with proper scope
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        await logSecurityEvent({
          action: 'USER_SIGN_OUT_ERROR',
          resource_type: 'auth',
          metadata: { error: error.message }
        });
      } else {
        console.log('Sign out successful');
      }
      
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      await logSecurityEvent({
        action: 'USER_SIGN_OUT_ERROR',
        resource_type: 'auth',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      // Always redirect regardless of errors
      window.location.href = '/';
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    logSecurityEvent: logSecurityEventWrapper,
    checkRateLimit
  };
};
