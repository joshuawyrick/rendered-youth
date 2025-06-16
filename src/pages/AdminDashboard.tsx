
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { useToast } from '@/components/ui/use-toast';
import DesignActionsDialog from '@/components/admin/DesignActionsDialog';
import AdminStats from '@/components/admin/AdminStats';
import DesignStatusCards from '@/components/admin/DesignStatusCards';

interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  created_at: string;
  user_id: string;
}

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleDesignClick = (design: Design) => {
    setSelectedDesign(design);
    setDialogOpen(true);
  };

  const handleDialogComplete = () => {
    // Trigger a refresh of the data
    setDialogOpen(false);
    setSelectedDesign(null);
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

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-ry-black mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage designs, track sales, and monitor your business performance
            </p>
          </div>

          {/* Stats Section */}
          <div className="mb-12">
            <AdminStats />
          </div>

          {/* Design Management Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-ry-black mb-6">
              Design Management
            </h2>
            <DesignStatusCards onDesignClick={handleDesignClick} />
          </div>
        </main>
      </div>

      <DesignActionsDialog
        design={selectedDesign}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onComplete={handleDialogComplete}
      />

      <Footer />
    </div>
  );
};

export default AdminDashboard;
