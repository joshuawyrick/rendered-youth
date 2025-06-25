
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Clock, CheckCircle, Star } from 'lucide-react';

interface Design {
  id: string;
  title: string;
  status: string;
  created_at: string;
  design_mockups?: any[];
  design_selections?: any[];
}

interface PendingApprovalsSectionProps {
  pendingDesigns: Design[];
}

const PendingApprovalsSection: React.FC<PendingApprovalsSectionProps> = ({ pendingDesigns }) => {
  const getStatusInfo = (design: Design) => {
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

  if (pendingDesigns.length === 0) {
    return null;
  }

  return (
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
  );
};

export default PendingApprovalsSection;
