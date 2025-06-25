
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
    // Check if user is already logged in and redirect to home page
    if (session && !authLoading) {
      console.log('User already authenticated, redirecting...', session.user?.email);
      window.location.href = '/';
    }
  }, [session, authLoading]);

  // Only show loading spinner for the initial auth check, not indefinitely
  if (authLoading && !session) {
    return <AuthLoadingSpinner />;
  }

  // If we have a session, show redirecting message
  if (session) {
    return (
      <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

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
