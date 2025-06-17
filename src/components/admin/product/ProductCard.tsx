
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Eye } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  onToggleStatus: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleStatus
}) => {
  return (
    <RYCard className="p-4">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <img 
            src={product.designs.file_url} 
            alt={product.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div>
            <h4 className="font-medium">{product.title}</h4>
            <p className="text-sm text-gray-600">
              by {product.designs.profiles?.first_name} {product.designs.profiles?.last_name}
            </p>
          </div>

          <div className="text-center">
            <p className="font-semibold">${Number(product.price).toFixed(2)}</p>
            <p className="text-xs text-gray-500">Price</p>
          </div>

          <div className="text-center">
            <p className="font-semibold">{(product.creator_commission_rate * 100).toFixed(0)}%</p>
            <p className="text-xs text-gray-500">Commission</p>
          </div>

          <div className="text-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.status}
            </span>
          </div>

          <div className="flex gap-2 justify-end">
            <RYButton
              variant="outline"
              size="sm"
              onClick={() => window.open(`/store/${product.title.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
            >
              <Eye className="h-4 w-4" />
            </RYButton>
            <RYButton
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(product)}
            >
              {product.status === 'active' ? 'Deactivate' : 'Activate'}
            </RYButton>
          </div>
        </div>
      </div>
    </RYCard>
  );
};

export default ProductCard;
