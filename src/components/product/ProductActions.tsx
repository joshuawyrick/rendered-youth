
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductActionsProps {
  price: number;
  productTitle: string;
  selectedSize: string;
  selectedColor: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  price,
  onAddToCart,
  onBuyNow
}) => {
  return (
    <div className="space-y-4">
      <RYButton
        variant="primary"
        size="lg"
        onClick={onBuyNow}
        className="w-full text-lg py-4"
      >
        Buy Now - ${Number(price).toFixed(2)}
      </RYButton>
      
      <div className="flex gap-3">
        <RYButton
          variant="secondary"
          size="lg"
          onClick={onAddToCart}
          className="flex-1"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </RYButton>
        
        <RYButton
          variant="outline"
          size="lg"
          className="px-4"
        >
          <Heart className="h-5 w-5" />
        </RYButton>
      </div>
    </div>
  );
};

export default ProductActions;
