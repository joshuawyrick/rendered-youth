
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Plus } from 'lucide-react';

interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface DesignCardProps {
  design: Design;
  creating: string | null;
  onCreateProduct: (design: Design) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  creating,
  onCreateProduct
}) => {
  return (
    <RYCard className="p-4">
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={design.file_url}
          alt={design.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-ry-black">{design.title}</h4>
        <p className="text-sm text-gray-600">
          by {design.profiles?.first_name} {design.profiles?.last_name}
        </p>
        
        <RYButton
          variant="primary"
          size="sm"
          onClick={() => onCreateProduct(design)}
          disabled={creating === design.id}
          className="w-full"
        >
          {creating === design.id ? (
            'Creating...'
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Create Product ($25.00)
            </>
          )}
        </RYButton>
      </div>
    </RYCard>
  );
};

export default DesignCard;
