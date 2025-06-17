
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  creator_commission_rate: number;
  created_at: string;
  design_id: string;
  designs: {
    title: string;
    file_url: string;
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

interface ProductManagementTabProps {
  products: Product[];
  onToggleProductStatus: (product: Product) => void;
}

const ProductManagementTab: React.FC<ProductManagementTabProps> = ({
  products,
  onToggleProductStatus
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Manage existing products and their settings
      </p>
      
      {products.length === 0 ? (
        <RYCard className="p-8 text-center">
          <p className="text-gray-500">No products created yet</p>
        </RYCard>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleStatus={onToggleProductStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagementTab;
