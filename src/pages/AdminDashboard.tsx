
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Eye, MoreHorizontal } from 'lucide-react';
import DesignActionsDialog from '@/components/admin/DesignActionsDialog';

interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  created_at: string;
  user_id: string;
}

const AdminDashboard = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      fetchPendingDesigns();
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
    if (!data) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
    }
  };

  const fetchPendingDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error fetching designs:', error);
      toast({
        title: "Error",
        description: "Failed to load pending designs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDesignClick = (design: Design) => {
    setSelectedDesign(design);
    setDialogOpen(true);
  };

  const handleDialogComplete = () => {
    fetchPendingDesigns();
  };

  if (!user || !isAdmin) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading...</div>
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
              Review and create mockups for submitted designs
            </p>
          </div>

          {designs.length === 0 ? (
            <RYCard className="p-12 text-center">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-ry-black mb-2">
                No Pending Designs
              </h2>
              <p className="text-gray-600">
                All caught up! No designs waiting for review.
              </p>
            </RYCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designs.map((design) => (
                <RYCard key={design.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={design.file_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-ry-black">
                        {design.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Submitted {new Date(design.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge variant="secondary">
                      {design.status.replace('_', ' ')}
                    </Badge>

                    <div className="space-y-2">
                      <RYButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleDesignClick(design)}
                        className="w-full"
                      >
                        <MoreHorizontal className="h-4 w-4 mr-2" />
                        Review & Create Mockups
                      </RYButton>
                      
                      <RYButton
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(design.file_url, '_blank')}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Size
                      </RYButton>
                    </div>
                  </div>
                </RYCard>
              ))}
            </div>
          )}
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
