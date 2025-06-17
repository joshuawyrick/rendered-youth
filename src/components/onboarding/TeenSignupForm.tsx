
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface TeenSignupFormProps {
  age: number;
}

const TeenSignupForm = ({ age }: TeenSignupFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    parentEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            age: age,
            parent_email: formData.parentEmail,
            account_type: 'teen'
          }
        }
      });

      if (authError) {
        toast({
          title: "Signup Error",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        
        // Redirect to a confirmation page or dashboard
        navigate('/creator/dashboard');
      }
    } catch (error) {
      console.error('Teen signup error:', error);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
      <RYCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-ry-black mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            You're {age} years old - let's get you started as a young creator!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ry-black mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ry-black mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ry-black mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ry-black mb-1">
              Parent/Guardian Email
            </label>
            <input
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll keep your parent informed about your account
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ry-black mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          <RYButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </RYButton>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Teen Creator Benefits:</strong><br />
            • Upload your artwork and earn money<br />
            • Get help from our teen support team<br />
            • Safe, monitored environment
          </p>
        </div>
      </RYCard>
    </div>
  );
};

export default TeenSignupForm;
