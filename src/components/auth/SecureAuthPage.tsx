
import React, { useState, useEffect } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { validateEmail, validatePassword } from '@/services/inputValidation';
import { sanitizeErrorMessage } from '@/services/enhancedSecurityService';
import { rateLimitService } from '@/services/rateLimitService';

const SecureAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ blocked: boolean; retryAfter?: number }>({ blocked: false });
  const { toast } = useToast();
  const { secureSignIn, secureSignUp, session } = useSecureAuth();

  useEffect(() => {
    // Redirect if already logged in
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

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }

    // For signup, validate password confirmation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkRateLimit = async (): Promise<boolean> => {
    const action = isLogin ? 'login' : 'signup';
    const result = await rateLimitService.checkRateLimit(action);
    
    if (!result.allowed) {
      setRateLimitInfo({ blocked: true, retryAfter: result.retryAfter });
      toast({
        title: "Too Many Attempts",
        description: `Please wait ${result.retryAfter} seconds before trying again.`,
        variant: "destructive",
      });
      return false;
    }
    
    setRateLimitInfo({ blocked: false });
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!(await checkRateLimit())) {
      return;
    }

    setLoading(true);

    try {
      let error;
      
      if (isLogin) {
        ({ error } = await secureSignIn(formData.email, formData.password));
      } else {
        ({ error } = await secureSignUp(formData.email, formData.password));
      }

      if (error) {
        toast({
          title: isLogin ? "Sign In Failed" : "Sign Up Failed",
          description: sanitizeErrorMessage(error),
          variant: "destructive",
        });
        return;
      }

      if (isLogin) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        window.location.href = '/';
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: sanitizeErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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

        {rateLimitInfo.blocked && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              Too many attempts. Please wait {rateLimitInfo.retryAfter} seconds before trying again.
            </p>
          </div>
        )}

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
              disabled={loading || rateLimitInfo.blocked}
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
              disabled={loading || rateLimitInfo.blocked}
            />
            {getFieldError('password') && !isLogin && (
              <div className="text-red-500 text-sm mt-1">
                {validationErrors.password?.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-ry-black mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                  getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                maxLength={128}
                disabled={loading || rateLimitInfo.blocked}
              />
              {getFieldError('confirmPassword') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('confirmPassword')}</p>
              )}
            </div>
          )}

          <RYButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading || rateLimitInfo.blocked}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </RYButton>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setValidationErrors({});
              setFormData({ email: '', password: '', confirmPassword: '' });
            }}
            className="text-ry-yellow hover:text-ry-black transition-colors"
            disabled={loading || rateLimitInfo.blocked}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {!isLogin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Password Requirements:</strong><br />
              • At least 8 characters long<br />
              • Include uppercase and lowercase letters<br />
              • Include at least one number<br />
              • Include at least one special character
            </p>
          </div>
        )}
      </RYCard>
    </div>
  );
};

export default SecureAuthPage;
