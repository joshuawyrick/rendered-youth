
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { Clock } from 'lucide-react';

interface PendingApprovalsSectionProps {
  pendingDesigns?: any[];
}

const PendingApprovalsSection: React.FC<PendingApprovalsSectionProps> = ({ 
  pendingDesigns = [] 
}) => {
  return (
    <RYCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-6 w-6 text-ry-yellow" />
        <h3 className="text-xl font-semibold text-ry-black">Pending Approvals</h3>
      </div>
      
      {pendingDesigns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No designs pending approval</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingDesigns.map((design, index) => (
            <div key={index} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">{design.title}</span>
                <span className="text-sm text-amber-600">Pending Review</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </RYCard>
  );
};

export default PendingApprovalsSection;
