
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
  onRemoveImage?: (index: number) => void;
  onUpdateAltText?: (index: number, altText: string) => void;
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
          <div key={`readonly-${index}`} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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

  const handleRemoveImage = (index: number) => {
    console.log('=== REMOVE IMAGE DEBUG ===');
    console.log('Removing image at index:', index);
    console.log('Image details:', {
      sortOrder: images[index]?.sortOrder,
      url: images[index]?.url?.substring(0, 50) + '...',
      altText: images[index]?.altText
    });
    console.log('=== END REMOVE DEBUG ===');
    
    onRemoveImage?.(index);
  };

  const handleAltTextChange = (index: number, altText: string) => {
    console.log('Alt text change for index:', index, 'new text:', altText);
    onUpdateAltText?.(index, altText);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {images.map((image, index) => {
        const isMainImage = image.sortOrder === 1;
        
        return (
          <div key={`image-${index}`} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt={image.altText}
                className="w-full h-full object-cover"
              />
            </div>
            
            {!isMainImage && (
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <RYButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1 h-6 w-6"
                >
                  <X className="w-3 h-3" />
                </RYButton>
              </div>
            )}
            
            <Input
              placeholder="Alt text"
              value={image.altText}
              onChange={(e) => handleAltTextChange(index, e.target.value)}
              className="mt-1 text-xs"
              readOnly={isMainImage}
              disabled={isMainImage}
            />
            
            {isMainImage && (
              <div className="absolute bottom-8 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                Main
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductImageGrid;
