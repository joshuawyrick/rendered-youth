
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

interface UseImageOperationsProps {
  images: ProductImage[];
  onImagesUpdate: (images: ProductImage[]) => void;
}

export const useImageOperations = ({ images, onImagesUpdate }: UseImageOperationsProps) => {
  const { toast } = useToast();

  const addImageByUrl = (imageUrl: string) => {
    if (!imageUrl.trim()) return;

    const newImage: ProductImage = {
      url: imageUrl,
      altText: `Product image ${images.length + 1}`,
      sortOrder: images.length + 1
    };

    onImagesUpdate([...images, newImage]);
    
    toast({
      title: "Image Added",
      description: "New image has been added to the product",
    });
  };

  const addImageFromFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        const newImage: ProductImage = {
          url: dataUrl,
          altText: `${file.name}`,
          sortOrder: images.length + 1
        };

        onImagesUpdate([...images, newImage]);
        
        toast({
          title: "Image Uploaded",
          description: "File has been added to the product",
        });

        resolve();
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageUrl: string) => {
    console.log('Before removal - images:', images.map(img => ({ url: img.url.substring(0, 50), sortOrder: img.sortOrder })));
    console.log('Removing image with URL:', imageUrl.substring(0, 50));
    
    // Find and remove the image by URL
    const updatedImages = images.filter(img => {
      const shouldKeep = img.url !== imageUrl;
      if (!shouldKeep) {
        console.log('Found image to remove:', { url: img.url.substring(0, 50), sortOrder: img.sortOrder });
      }
      return shouldKeep;
    });
    
    console.log('After filtering - remaining images:', updatedImages.length);
    
    // Reorder the remaining images
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      sortOrder: i + 1
    }));
    
    console.log('After reordering:', reorderedImages.map(img => ({ url: img.url.substring(0, 50), sortOrder: img.sortOrder })));
    
    onImagesUpdate(reorderedImages);
    
    toast({
      title: "Image Removed",
      description: "Image has been removed from the product",
    });
  };

  const updateImageAltText = (imageUrl: string, altText: string) => {
    const updatedImages = images.map(img => 
      img.url === imageUrl ? { ...img, altText } : img
    );
    onImagesUpdate(updatedImages);
  };

  return {
    addImageByUrl,
    addImageFromFile,
    removeImage,
    updateImageAltText
  };
};
