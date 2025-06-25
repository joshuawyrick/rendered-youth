
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RYCard } from './ry-card';
import { RYButton } from './ry-button';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  creatorName: string;
  creatorAge: string;
  creatorState: string;
  imageUrl?: string;
  collectionId?: string;
  design?: {
    file_url: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

interface ProductCardProps {
  product: Product;
  showViewButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showViewButton = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to product detail page using product ID
    navigate(`/store/${product.id}`);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/store/${product.id}`);
  };

  return (
    <RYCard 
      className="group cursor-pointer overflow-hidden p-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.design?.file_url || product.imageUrl || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-ry-black mb-1 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          by {product.creatorName} • Age {product.creatorAge}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-ry-black">
            ${Number(product.price).toFixed(2)}
          </span>
          
          {product.variants && product.variants.length > 0 && (
            <span className="text-xs text-gray-500">
              {product.variants.filter(v => v.is_available).length} variants
            </span>
          )}
        </div>

        {/* View Button for Featured Section */}
        {showViewButton && (
          <div className="mt-3">
            <RYButton
              variant="secondary"
              size="sm"
              className="w-full bg-ry-yellow hover:bg-ry-yellow/80 text-ry-black font-semibold"
              onClick={handleViewClick}
            >
              View
            </RYButton>
          </div>
        )}
      </div>
    </RYCard>
  );
};
