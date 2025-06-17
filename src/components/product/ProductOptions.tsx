
import React from 'react';

interface ProductOptionsProps {
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange
}) => {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Gray'];

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-ry-black mb-3">Size</h3>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                selectedSize === size
                  ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-semibold text-ry-black mb-3">Color</h3>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                selectedColor === color
                  ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
