
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
    console.log('=== IMAGE REMOVAL DEBUG ===');
    console.log('Attempting to remove image with URL:', imageUrl.substring(0, 50) + '...');
    console.log('Current images before removal:');
    images.forEach((img, idx) => {
      console.log(`  [${idx}] Sort: ${img.sortOrder}, URL: ${img.url.substring(0, 50)}...`);
    });
    
    // Find the image to remove
    const imageToRemove = images.find(img => img.url === imageUrl);
    if (!imageToRemove) {
      console.error('Image not found in array!');
      toast({
        title: "Error",
        description: "Image not found",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Found image to remove:', {
      sortOrder: imageToRemove.sortOrder,
      url: imageToRemove.url.substring(0, 50) + '...'
    });
    
    // Remove the image by URL (exact match)
    const updatedImages = images.filter(img => img.url !== imageUrl);
    
    console.log('Images after filtering:', updatedImages.length);
    
    // Reorder the remaining images
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      sortOrder: i + 1
    }));
    
    console.log('Final reordered images:');
    reorderedImages.forEach((img, idx) => {
      console.log(`  [${idx}] Sort: ${img.sortOrder}, URL: ${img.url.substring(0, 50)}...`);
    });
    console.log('=== END DEBUG ===');
    
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
