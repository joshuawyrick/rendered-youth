import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { StatsWidget } from '@/components/ui/stats-widget';
import { Upload, User, Eye, DollarSign, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

  const selectedDesigns = allDesigns.filter(design => 
    design.design_selections?.length > 0
  );

  const publishedDesigns = allDesigns.filter(design => 
    design.status === 'published'
  );

  const getStatusInfo = (design: any) => {
    if (design.design_selections?.length > 0) {
      return {
        status: 'Selected',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-4 w-4" />,
        action: null
      };
    }
    
    if (design.status === 'mockups_ready' && design.design_mockups?.length > 0) {
      return {
        status: 'Ready to Review',
        color: 'bg-blue-100 text-blue-800',
        icon: <Star className="h-4 w-4" />,
        action: (
          <RYButton
            variant="primary"
            size="sm"
            onClick={() => window.location.href = `/admin/review?design=${design.id}`}
          >
            <Star className="h-4 w-4 mr-2" />
            Review & Select
          </RYButton>
        )
      };
    }
    
    return {
      status: 'Waiting for Admin',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="h-4 w-4" />,
      action: null
    };
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-4">
              Creator Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back! Here's how your designs are performing.
            </p>
          </div>

          {/* Pending Approvals Section */}
          {pendingDesigns.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-ry-black mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-ry-yellow" />
                Pending Approvals ({pendingDesigns.length})
              </h2>
              <div className="grid gap-4 mb-6">
                {pendingDesigns.map((design) => {
                  const statusInfo = getStatusInfo(design);
                  return (
                    <RYCard key={design.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-ry-black">
                              {design.title}
                            </h3>
                            <div className={`px-3 py-1 text-sm rounded-lg font-medium flex items-center gap-2 ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.status}
                            </div>
                          </div>
                          <p className="text-gray-600">
                            {statusInfo.status === 'Ready to Review' 
                              ? 'Your design mockups are ready! Click to review and select your favorite.'
                              : 'Your design is being reviewed by our team. We\'ll notify you when mockups are ready.'
                            }
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Submitted on {new Date(design.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {statusInfo.action && (
                          <div className="ml-4">
                            {statusInfo.action}
                          </div>
                        )}
                      </div>
                    </RYCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatsWidget
              label="Total Earnings"
              value={`$${stats.totalEarnings.toFixed(2)}`}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatsWidget
              label="Tees Sold"
              value={stats.teesSold.toString()}
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <StatsWidget
              label="Pending Approvals"
              value={pendingDesigns.length.toString()}
              icon={<Eye className="h-6 w-6" />}
            />
            <StatsWidget
              label="Total Designs"
              value={allDesigns.length.toString()}
              icon={<Upload className="h-6 w-6" />}
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-ry-black mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <RYButton 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/creator/upload'}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload New Design
              </RYButton>
              <RYButton 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.href = '/creator/profile'}
              >
                <User className="h-5 w-5 mr-2" />
                Edit Profile
              </RYButton>
            </div>
          </div>

          {/* Recent Designs */}
          <div>
            <h2 className="text-2xl font-semibold text-ry-black mb-6">My Designs</h2>
            <div className="grid gap-4">
              {recentDesigns.map((design) => (
                <RYCard key={design.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-ry-black">
                          {design.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-lg font-medium ${getStatusColor(design.status)}`}>
                          {design.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Uploaded on {new Date(design.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-ry-black">
                        ${design.earnings.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {design.sales} sales
                      </p>
                    </div>
                  </div>
                </RYCard>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <RYButton 
                variant="outline" 
                onClick={() => window.location.href = '/creator/collection'}
              >
                View All Designs
              </RYButton>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorDashboard;
