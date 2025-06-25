
import React, { useState } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword } from '@/services/inputValidation';
import { sanitizeErrorMessage } from '@/services/enhancedSecurityService';
import { PasswordRequirements } from './PasswordRequirements';

interface AuthFormProps {
  isLogin: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    // Basic sanitization
    const sanitizedValue = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
      
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
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (isLogin) {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        });

        if (error) {
          toast({
            title: "Error signing in",
            description: sanitizeErrorMessage(error),
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        
        // Redirect will be handled by the useEffect in Auth component
      } else {
        // Sign up
        const redirectUrl = `${window.location.origin}/`;

        const { data, error } = await supabase.auth.signUp({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              account_type: 'customer'
            }
          }
        });

        if (error) {
          toast({
            title: "Error creating account",
            description: sanitizeErrorMessage(error),
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        
        setLoading(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      
      toast({
        title: "Unexpected error",
        description: sanitizeErrorMessage(error),
        variant: "destructive",
      });
      
      setLoading(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field]?.[0];
  };

  return (
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

      {!isLogin && <PasswordRequirements />}

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
  );
};
