
import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProductDetail } from './types';

interface ProductInfoProps {
  product: ProductDetail;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCreatorClick = () => {
    // Navigate to creator page using the creator's user_id
    navigate(`/creator/${product.designs.user_id}`);
  };

  return (
    <div className="space-y-6">
      {/* Title and Creator */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-ry-black mb-2">
          {product.title}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-lg text-gray-600">Created by</span>
          <button
            onClick={handleCreatorClick}
            className="text-lg font-medium text-ry-black hover:text-ry-yellow transition-colors underline decoration-2 underline-offset-2 hover:decoration-ry-yellow"
          >
            {product.designs.profiles?.first_name} {product.designs.profiles?.last_name}
          </button>
          {product.designs.profiles?.age_bracket && (
            <span className="ml-2 px-2 py-1 bg-ry-yellow text-ry-black text-sm rounded-full">
              Age {product.designs.profiles.age_bracket}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-ry-black">
          ${Number(product.price).toFixed(2)}
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-gray-600 ml-2">(42 reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
