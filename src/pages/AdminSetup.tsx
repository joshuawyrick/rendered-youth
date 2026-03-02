
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .insert({ user_id: user.id });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already an admin",
            description: "You are already an admin user",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You are now an admin user",
        });
      }
    } catch (error) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: "Failed to make user admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-40">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <RYCard className="p-8 text-center">
            <h1 className="text-2xl font-bold text-ry-black mb-4">
              Admin Setup
            </h1>
            <p className="text-gray-600 mb-6">
              Click the button below to make yourself an admin user. This will give you access to the admin dashboard.
            </p>
            <RYButton
              onClick={makeCurrentUserAdmin}
              disabled={loading || !user}
              variant="primary"
            >
              {loading ? 'Adding...' : 'Make Me Admin'}
            </RYButton>
          </RYCard>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminSetup;
