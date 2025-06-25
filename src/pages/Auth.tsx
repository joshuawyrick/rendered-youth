
import React, { useState, useEffect } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoadingSpinner } from '@/components/auth/AuthLoadingSpinner';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthToggle } from '@/components/auth/AuthToggle';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    // If we have a session and we're not loading, redirect immediately
    if (session && !authLoading) {
      console.log('User already authenticated, redirecting...', session.user?.email);
      // Use setTimeout to ensure this runs after the current render cycle
      setTimeout(() => {
        window.location.href = '/';
      }, 0);
    }
  }, [session, authLoading]);

  // Show loading only during the initial auth check AND when we don't have a session
  if (authLoading && !session) {
    console.log('Showing loading spinner - authLoading:', authLoading, 'session:', !!session);
    return <AuthLoadingSpinner />;
  }

  // If we have a session, show a brief redirecting message instead of the form
  if (session) {
    console.log('User has session, showing redirecting message');
    return (
      <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // If we reach here, user is not authenticated and we can show the form
  console.log('Showing auth form - authLoading:', authLoading, 'session:', !!session);

  return (
    <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
      <RYCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ry-black mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to upload your art' : 'Join Rendered Youth today'}
          </p>
        </div>

        <AuthForm isLogin={isLogin} />
        
        <AuthToggle 
          isLogin={isLogin} 
          onToggle={() => setIsLogin(!isLogin)} 
          loading={false}
        />
      </RYCard>
    </div>
  );
};

export default Auth;
