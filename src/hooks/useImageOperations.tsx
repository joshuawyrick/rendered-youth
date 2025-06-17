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
    console.log('=== IMAGE REMOVAL DEBUG START ===');
    console.log('Attempting to remove image with URL:', imageUrl.substring(0, 50) + '...');
    console.log('Current images array length:', images.length);
    
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
    
    console.log('Found image to remove with sortOrder:', imageToRemove.sortOrder);
    
    // Check if this is the main image (sortOrder 1)
    const isMainImage = imageToRemove.sortOrder === 1;
    console.log('Is main image:', isMainImage);
    
    if (isMainImage) {
      // For main image, we need special handling
      console.log('Cannot delete main design image - this comes from the design itself');
      toast({
        title: "Cannot Delete",
        description: "The main image cannot be deleted as it's the core design. You can only delete additional images.",
        variant: "destructive",
      });
      return;
    }
    
    // Remove the image by filtering out the exact URL match
    const filteredImages = images.filter(img => img.url !== imageUrl);
    console.log('Images after filtering:', filteredImages.length);
    
    // Reorder the remaining images, preserving the main image at position 1
    const reorderedImages = filteredImages.map((img, index) => {
      if (img.sortOrder === 1) {
        // Keep main image at sortOrder 1
        return img;
      } else {
        // Reorder additional images starting from 2
        const mainImageExists = filteredImages.some(i => i.sortOrder === 1);
        const newSortOrder = mainImageExists ? index + 1 : index + 1;
        return {
          ...img,
          sortOrder: newSortOrder
        };
      }
    }).sort((a, b) => a.sortOrder - b.sortOrder);
    
    console.log('Final reordered images:', reorderedImages.map(img => ({ 
      sortOrder: img.sortOrder, 
      url: img.url.substring(0, 30) + '...' 
    })));
    console.log('=== IMAGE REMOVAL DEBUG END ===');
    
    onImagesUpdate(reorderedImages);
    
    toast({
      title: "Image Removed",
      description: "Additional image has been removed from the product",
    });
  };

  const updateImageAltText = (imageUrl: string, altText: string) => {
    console.log('Updating alt text for:', imageUrl.substring(0, 30) + '...', 'to:', altText);
    
    const imageToUpdate = images.find(img => img.url === imageUrl);
    if (!imageToUpdate) {
      console.error('Image not found for alt text update');
      return;
    }
    
    // Check if this is the main image
    if (imageToUpdate.sortOrder === 1) {
      console.log('Cannot update alt text for main design image');
      toast({
        title: "Cannot Edit",
        description: "The main image's text cannot be edited as it's tied to the design.",
        variant: "destructive",
      });
      return;
    }
    
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
