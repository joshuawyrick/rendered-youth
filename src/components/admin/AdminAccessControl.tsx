
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/navigation/TopNav';
import { RYCard } from '@/components/ui/ry-card';
import { useToast } from '@/components/ui/use-toast';

interface AdminAccessControlProps {
  children: React.ReactNode;
}

const AdminAccessControl = ({ children }: AdminAccessControlProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    setIsAdmin(!!data);
    setLoading(false);
    
    if (!data) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <RYCard className="p-8 text-center">
            <h1 className="text-2xl font-bold text-ry-black mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </RYCard>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAccessControl;
