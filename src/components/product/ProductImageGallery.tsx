
import React from 'react';

interface ProductImageGalleryProps {
  imageUrl: string;
  title: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  imageUrl,
  title
}) => {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Additional product images */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-lg">
            <img
              src={imageUrl}
              alt={`${title} view ${i}`}
              className="w-full h-full object-cover rounded-lg opacity-50"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
