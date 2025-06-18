
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal,
  Calendar,
  Package,
  Eye
} from 'lucide-react';
import type { Design, StatusInfo } from './types';

interface DesignCardProps {
  design: Design;
  statusInfo: StatusInfo;
  onDesignClick: (design: Design) => void;
  onPublishClick: (design: Design) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  statusInfo,
  onDesignClick,
  onPublishClick
}) => {
  return (
    <RYCard className="p-4 hover:shadow-lg transition-shadow">
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
          {design.status === 'pending_review' && (
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
          {design.status === 'selected' && (
            <RYButton
              variant="primary"
              size="sm"
              onClick={() => onPublishClick(design)}
              className="flex-1"
            >
              <Package className="h-4 w-4 mr-1" />
              Publish Product
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
  );
};

export default DesignCard;
