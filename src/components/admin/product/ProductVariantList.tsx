
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

interface ProductVariantListProps {
  variants: ProductVariant[];
  basePrice: number;
  onUpdateVariant: (index: number, field: keyof ProductVariant, value: any) => void;
  onRemoveVariant: (index: number) => void;
}

const ProductVariantList: React.FC<ProductVariantListProps> = ({
  variants,
  basePrice,
  onUpdateVariant,
  onRemoveVariant
}) => {
  return (
    <RYCard className="p-4">
      <h3 className="text-lg font-semibold mb-4">Current Variants ({variants.length})</h3>
      {variants.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No variants added yet. Use the form above to add size and color combinations.</p>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <div className="grid gap-2">
            <div className="grid grid-cols-7 gap-2 items-center p-2 bg-gray-50 rounded font-medium">
              <div>Size</div>
              <div>Color</div>
              <div>Price Adj. ($)</div>
              <div>Final Price</div>
              <div>Available</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {variants.map((variant, index) => (
              <div key={`${variant.size}-${variant.color}`} className="grid grid-cols-7 gap-2 items-center p-2 border rounded">
                <div className="font-medium">{variant.size}</div>
                <div>{variant.color}</div>
                <Input
                  type="number"
                  step="0.01"
                  value={variant.priceAdjustment}
                  onChange={(e) => onUpdateVariant(index, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
                <div className="text-sm font-medium">
                  ${(basePrice + variant.priceAdjustment).toFixed(2)}
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={variant.isAvailable}
                    onChange={(e) => onUpdateVariant(index, 'isAvailable', e.target.checked)}
                    className="mr-2"
                  />
                </label>
                <div className="text-xs text-gray-500">
                  {variant.isAvailable ? 'Active' : 'Disabled'}
                </div>
                <RYButton
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveVariant(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </RYButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </RYCard>
  );
};

export default ProductVariantList;
