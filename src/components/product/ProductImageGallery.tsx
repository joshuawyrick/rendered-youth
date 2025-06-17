
import React, { useState } from 'react';

interface ProductImage {
  url: string;
  altText: string;
  sortOrder: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  title: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  title
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : [
    { url: '/placeholder.svg', altText: title, sortOrder: 1 }
  ];

  const selectedImage = displayImages[selectedImageIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        <img
          src={selectedImage.url}
          alt={selectedImage.altText}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnail Grid */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImageIndex === index 
                  ? 'border-ry-yellow' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.altText}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Image Counter */}
      {displayImages.length > 1 && (
        <div className="text-center text-sm text-gray-500">
          {selectedImageIndex + 1} of {displayImages.length}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
