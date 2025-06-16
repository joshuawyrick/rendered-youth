
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Eye, Check, X } from 'lucide-react';

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

  const handleCreateMockups = async (designId: string) => {
    try {
      // For demo purposes, create 4 mockup placeholders
      const mockupUrls = [
        'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Mockup+1',
        'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Mockup+2',
        'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Mockup+3',
        'https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Mockup+4'
      ];

      for (let i = 0; i < mockupUrls.length; i++) {
        await supabase
          .from('design_mockups')
          .insert({
            design_id: designId,
            mockup_url: mockupUrls[i],
            mockup_order: i + 1
          });
      }

      // Update design status
      await supabase
        .from('designs')
        .update({ status: 'review_ready' })
        .eq('id', designId);

      // Send notification email
      await supabase.functions.invoke('send-review-notification', {
        body: { designId }
      });

      toast({
        title: "Mockups Created!",
        description: "The creator has been notified that their design is ready for review",
      });

      fetchPendingDesigns();
    } catch (error) {
      console.error('Error creating mockups:', error);
      toast({
        title: "Error",
        description: "Failed to create mockups",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (designId: string) => {
    try {
      await supabase
        .from('designs')
        .update({ status: 'rejected' })
        .eq('id', designId);

      toast({
        title: "Design Rejected",
        description: "The design has been rejected",
        variant: "destructive",
      });

      fetchPendingDesigns();
    } catch (error) {
      console.error('Error rejecting design:', error);
      toast({
        title: "Error",
        description: "Failed to reject design",
        variant: "destructive",
      });
    }
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
              Review and manage submitted designs
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
                <RYCard key={design.id} className="p-6">
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

                    <div className="flex gap-2">
                      <RYButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleCreateMockups(design.id)}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Create Mockups
                      </RYButton>
                      
                      <RYButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReject(design.id)}
                      >
                        <X className="h-4 w-4" />
                      </RYButton>
                    </div>

                    <RYButton
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(design.file_url, '_blank')}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Size
                    </RYButton>
                  </div>
                </RYCard>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
