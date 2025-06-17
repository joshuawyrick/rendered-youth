
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

interface ProductImageGridProps {
  images: ProductImage[];
  readOnly?: boolean;
  onRemoveImage?: (imageUrl: string) => void;
  onUpdateAltText?: (imageUrl: string, altText: string) => void;
}

const ProductImageGrid: React.FC<ProductImageGridProps> = ({
  images,
  readOnly = false,
  onRemoveImage,
  onUpdateAltText
}) => {
  if (readOnly) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={`readonly-${image.url}-${index}`} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image.url}
              alt={image.altText}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  const handleRemoveImage = (imageUrl: string, sortOrder: number) => {
    console.log('=== BUTTON CLICK DEBUG ===');
    console.log('Button clicked for image:', {
      url: imageUrl.substring(0, 50) + '...',
      sortOrder: sortOrder
    });
    console.log('Calling onRemoveImage with URL:', imageUrl.substring(0, 50) + '...');
    console.log('=== END BUTTON DEBUG ===');
    
    onRemoveImage?.(imageUrl);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {images.map((image) => (
        <div key={`editable-${image.url}-${image.sortOrder}`} className="relative group">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image.url}
              alt={image.altText}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <RYButton
              variant="secondary"
              size="sm"
              onClick={() => handleRemoveImage(image.url, image.sortOrder)}
              className="p-1 h-6 w-6"
            >
              <X className="w-3 h-3" />
            </RYButton>
          </div>
          <Input
            placeholder="Alt text"
            value={image.altText}
            onChange={(e) => onUpdateAltText?.(image.url, e.target.value)}
            className="mt-1 text-xs"
          />
          {image.sortOrder === 1 && (
            <div className="absolute bottom-8 left-1 bg-blue-500 text-white text-xs px-1 rounded">
              Main
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductImageGrid;
