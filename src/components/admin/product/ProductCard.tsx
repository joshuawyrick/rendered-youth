
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, EyeOff } from 'lucide-react';
import type { Product } from './types';

interface ProductCardProps {
  product: Product;
  onToggleStatus: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleStatus,
  onEdit
}) => {
  return (
    <RYCard className="p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.designs.file_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-ry-black truncate">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                by {product.designs.profiles.first_name} {product.designs.profiles.last_name}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-ry-black">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.base_price && Number(product.base_price) !== Number(product.price) && (
                  <span className="text-sm text-gray-500">
                    Base: ${Number(product.base_price).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                  {product.status}
                </Badge>
                {product.collection_name && (
                  <Badge variant="outline">
                    {product.collection_name}
                  </Badge>
                )}
                {product.assigned_user_name && (
                  <Badge variant="outline">
                    Assigned: {product.assigned_user_name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {onEdit && (
                <RYButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="w-4 h-4" />
                </RYButton>
              )}
              <RYButton
                variant={product.status === 'active' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => onToggleStatus(product)}
              >
                {product.status === 'active' ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </RYButton>
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </RYCard>
  );
};

export default ProductCard;
