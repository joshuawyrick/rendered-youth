
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import CreatorDashboardHeader from '@/components/creator/CreatorDashboardHeader';
import CreatorStatsGrid from '@/components/creator/CreatorStatsGrid';
import RecentDesignsSection from '@/components/creator/RecentDesignsSection';
import PendingApprovalsSection from '@/components/creator/PendingApprovalsSection';
import QuickActionsSection from '@/components/creator/QuickActionsSection';
import CreatorEarningsSection from '@/components/creator/CreatorEarningsSection';
import StripeConnectSetup from '@/components/creator/StripeConnectSetup';
import { useCreatorEarnings } from '@/hooks/useCreatorEarnings';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecentDesign {
  id: string;
  title: string;
  status: string;
  uploadDate: string;
  sales: number;
  earnings: number;
}

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { summary: earningsSummary } = useCreatorEarnings();
  const [recentDesigns, setRecentDesigns] = useState<RecentDesign[]>([]);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch designs
      const { data: designs, error: designsError } = await supabase
        .from('designs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (designsError) {
        console.error('Error fetching designs:', designsError);
        return;
      }

      const designsData = designs || [];
      setTotalDesigns(designsData.length);
      setPendingApprovalsCount(designsData.filter(d => d.status === 'pending_review').length);

      // Format recent designs with placeholder sales data
      const formattedDesigns: RecentDesign[] = designsData.slice(0, 5).map(design => ({
        id: design.id,
        title: design.title,
        status: design.status || 'pending',
        uploadDate: design.created_at,
        sales: 0, // Will be calculated from actual sales data when available
        earnings: 0 // Will be calculated from creator_earnings when available
      }));

      setRecentDesigns(formattedDesigns);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white">
      <div className="max-w-7xl mx-auto p-6">
        <CreatorDashboardHeader />
        
        <CreatorStatsGrid
          totalEarnings={earningsSummary.total_earnings}
          teesSold={earningsSummary.total_sales}
          pendingApprovalsCount={pendingApprovalsCount}
          totalDesigns={totalDesigns}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <CreatorEarningsSection />
          </div>
          <div>
            <StripeConnectSetup />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentDesignsSection recentDesigns={recentDesigns} />
          <div className="space-y-8">
            <PendingApprovalsSection />
            <QuickActionsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
