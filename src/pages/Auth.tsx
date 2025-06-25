import React, { useState, useEffect } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import { validateEmail, validatePassword } from '@/services/inputValidation';
import { sanitizeErrorMessage } from '@/services/enhancedSecurityService';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { secureSignIn, secureSignUp, sanitizeInput, session } = useSecureAuth();
  const { logSecurityEvent, checkRateLimit } = useAuthSecurity();

  useEffect(() => {
    // Check if user is already logged in and redirect to home page
    if (session) {
      window.location.href = '/';
    }
  }, [session]);

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }

    // Validate password for signup
    if (!isLogin) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors;
      }
    } else {
      // For login, just check if password is provided
      if (!formData.password) {
        errors.password = ['Password is required'];
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const action = isLogin ? 'signin' : 'signup';
      
      // Check rate limits
      const canProceed = await checkRateLimit(action, formData.email);
      if (!canProceed) {
        toast({
          title: "Too Many Attempts",
          description: "Please wait before trying again.",
          variant: "destructive",
        });
        return;
      }

      if (isLogin) {
        // Sign in
        await logSecurityEvent('auth_signin_attempt', {
          email: formData.email,
          timestamp: new Date().toISOString()
        });

        const { error } = await secureSignIn(formData.email, formData.password);

        if (error) {
          await logSecurityEvent('auth_signin_failed', {
            email: formData.email,
            error: error.message,
            timestamp: new Date().toISOString()
          });
          
          toast({
            title: "Error signing in",
            description: sanitizeErrorMessage(error),
            variant: "destructive",
          });
          return;
        }

        await logSecurityEvent('auth_signin_success', {
          email: formData.email,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        
        // Redirect to home page after successful login
        window.location.href = '/';
      } else {
        // Sign up
        await logSecurityEvent('auth_signup_attempt', {
          email: formData.email,
          timestamp: new Date().toISOString()
        });

        const { error } = await secureSignUp(
          formData.email,
          formData.password,
          {
            account_type: 'customer'
          }
        );

        if (error) {
          await logSecurityEvent('auth_signup_failed', {
            email: formData.email,
            error: error.message,
            timestamp: new Date().toISOString()
          });
          
          toast({
            title: "Error creating account",
            description: sanitizeErrorMessage(error),
            variant: "destructive",
          });
          return;
        }

        await logSecurityEvent('auth_signup_success', {
          email: formData.email,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      
      await logSecurityEvent('auth_error', {
        email: formData.email,
        action: isLogin ? 'signin' : 'signup',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Unexpected error",
        description: sanitizeErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field]?.[0];
  };

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

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ry-black mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                getFieldError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              maxLength={254}
            />
            {getFieldError('email') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ry-black mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                getFieldError('password') ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              maxLength={128}
            />
            {getFieldError('password') && (
              <div className="text-red-500 text-sm mt-1">
                {validationErrors.password?.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Password Requirements:</strong><br />
                • At least 8 characters long<br />
                • Include uppercase and lowercase letters<br />
                • Include at least one number<br />
                • Include at least one special character
              </p>
            </div>
          )}

          <RYButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </RYButton>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-ry-yellow hover:text-ry-black transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </RYCard>
    </div>
  );
};

export default Auth;
