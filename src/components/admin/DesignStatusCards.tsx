
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Eye, 
  Star, 
  CheckCircle,
  MoreHorizontal,
  Calendar
} from 'lucide-react';

interface DesignStatusCardsProps {
  onDesignClick: (design: any) => void;
}

const DesignStatusCards = ({ onDesignClick }: DesignStatusCardsProps) => {
  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['admin-designs-by-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          status,
          created_at,
          file_url,
          design_mockups(id),
          design_selections(id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        return [];
      }

      return data || [];
    },
  });

  const getStatusInfo = (status: string, mockupsCount: number, selectionsCount: number) => {
    switch (status) {
      case 'pending_review':
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending Review',
          description: 'Waiting for admin to create mockups'
        };
      case 'mockups_ready':
        return {
          icon: <Eye className="h-4 w-4" />,
          color: 'bg-blue-100 text-blue-800',
          label: 'Ready for Creator',
          description: 'Mockups created, waiting for creator selection'
        };
      case 'selected':
        return {
          icon: <Star className="h-4 w-4" />,
          color: 'bg-purple-100 text-purple-800',
          label: 'Selected',
          description: 'Creator has selected their favorite mockup'
        };
      case 'published':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800',
          label: 'Published',
          description: 'Live on the store and available for purchase'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-800',
          label: status,
          description: 'Unknown status'
        };
    }
  };

  const groupedDesigns = designs.reduce((acc, design) => {
    const status = design.status || 'pending_review';
    if (!acc[status]) acc[status] = [];
    acc[status].push(design);
    return acc;
  }, {} as Record<string, typeof designs>);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedDesigns).map(([status, statusDesigns]) => {
        const statusInfo = getStatusInfo(status, 0, 0);
        
        return (
          <div key={status}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                {statusInfo.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ry-black">
                  {statusInfo.label} ({statusDesigns.length})
                </h3>
                <p className="text-sm text-gray-600">{statusInfo.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statusDesigns.map((design) => (
                <RYCard key={design.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={design.file_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-ry-black truncate">{design.title}</h4>
                      <Badge variant="secondary" className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(design.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2">
                      {status === 'pending_review' && (
                        <RYButton
                          variant="primary"
                          size="sm"
                          onClick={() => onDesignClick(design)}
                          className="flex-1"
                        >
                          <MoreHorizontal className="h-4 w-4 mr-1" />
                          Create Mockups
                        </RYButton>
                      )}
                      {status === 'selected' && (
                        <RYButton
                          variant="primary"
                          size="sm"
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Publish to Store
                        </RYButton>
                      )}
                      <RYButton
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(design.file_url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </RYButton>
                    </div>
                  </div>
                </RYCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DesignStatusCards;
