
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import DesignCard from './DesignCard';

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

interface ProductCreationTabProps {
  availableDesigns: Design[];
  creating: string | null;
  onCreateProduct: (design: Design) => void;
}

const ProductCreationTab: React.FC<ProductCreationTabProps> = ({
  availableDesigns,
  creating,
  onCreateProduct
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Convert published designs into sellable products
      </p>
      
      {availableDesigns.length === 0 ? (
        <RYCard className="p-8 text-center">
          <p className="text-gray-500">No designs available for product creation</p>
          <p className="text-sm text-gray-400 mt-1">
            All published designs have already been converted to products
          </p>
        </RYCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              creating={creating}
              onCreateProduct={onCreateProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCreationTab;
