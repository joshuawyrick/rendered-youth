
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import ProductCard from './ProductCard';
import type { Product } from './types';

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
