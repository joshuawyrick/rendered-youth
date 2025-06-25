
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CreatorDashboardHeader from '@/components/creator/CreatorDashboardHeader';
import PendingApprovalsSection from '@/components/creator/PendingApprovalsSection';
import CreatorStatsGrid from '@/components/creator/CreatorStatsGrid';
import QuickActionsSection from '@/components/creator/QuickActionsSection';
import RecentDesignsSection from '@/components/creator/RecentDesignsSection';

const CreatorDashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const stats = {
    totalEarnings: 342.50,
    teesSold: 47,
    pendingApprovals: 2,
    totalDesigns: 12
  };

  // Fetch all designs for the user
  const { data: allDesigns = [] } = useQuery({
    queryKey: ['user-designs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          status,
          created_at,
          design_mockups(id),
          design_selections(selected_mockup_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Filter designs by status
  const pendingDesigns = allDesigns.filter(design => 
    design.status === 'pending_review' || 
    (design.status === 'mockups_ready' && !design.design_selections?.length)
  );

  const recentDesigns = [
    {
      id: '1',
      title: 'Rainbow Dragon',
      status: 'published',
      uploadDate: '2024-01-15',
      sales: 23,
      earnings: 161.00
    },
    {
      id: '2',
      title: 'Space Adventure',
      status: 'approved',
      uploadDate: '2024-01-20',
      sales: 0,
      earnings: 0
    },
    {
      id: '3',
      title: 'Ocean Dreams',
      status: 'pending',
      uploadDate: '2024-01-25',
      sales: 0,
      earnings: 0
    }
  ];

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CreatorDashboardHeader />
          
          <PendingApprovalsSection pendingDesigns={pendingDesigns} />

          <CreatorStatsGrid
            totalEarnings={stats.totalEarnings}
            teesSold={stats.teesSold}
            pendingApprovalsCount={pendingDesigns.length}
            totalDesigns={allDesigns.length}
          />

          <QuickActionsSection />

          <RecentDesignsSection recentDesigns={recentDesigns} />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorDashboard;
