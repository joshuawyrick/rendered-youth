
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    creatorName: string;
    creatorAge?: string;
    creatorState?: string;
    imageUrl?: string;
  };
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  return (
    <RYCard className={cn(
      "p-0 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer",
      className
    )}>
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center border-b border-gray-200">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">👕</div>
            <p className="text-sm text-gray-500">{product.title}</p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-ry-black mb-1">
          {product.title}
        </h3>
        
        {/* Creator Info */}
        <p className="text-sm text-gray-600 mb-2">
          by {product.creatorName}
        </p>

        {/* Creator Tags */}
        <div className="flex gap-2 mb-3">
          {product.creatorAge && (
            <span className="px-2 py-1 bg-ry-yellow text-ry-black text-xs rounded-lg font-medium">
              Ages {product.creatorAge}
            </span>
          )}
          {product.creatorState && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
              {product.creatorState}
            </span>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-ry-black text-lg">
            ${product.price}
          </span>
          <RYButton 
            variant="primary" 
            size="sm"
            onClick={() => window.location.href = `/store/${product.slug}`}
          >
            View
          </RYButton>
        </div>
      </div>
    </RYCard>
  );
};

export { ProductCard };
