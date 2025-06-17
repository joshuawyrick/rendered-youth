
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

  const removeImage = (index: number) => {
    console.log('=== IMAGE REMOVAL BY INDEX DEBUG START ===');
    console.log('Attempting to remove image at index:', index);
    console.log('Current images array length:', images.length);
    
    if (index < 0 || index >= images.length) {
      console.error('Invalid index:', index);
      toast({
        title: "Error",
        description: "Invalid image selection",
        variant: "destructive",
      });
      return;
    }
    
    const imageToRemove = images[index];
    console.log('Image to remove:', {
      index,
      sortOrder: imageToRemove.sortOrder,
      url: imageToRemove.url.substring(0, 50) + '...',
      altText: imageToRemove.altText
    });
    
    // Check if this is the main image (sortOrder 1)
    const isMainImage = imageToRemove.sortOrder === 1;
    console.log('Is main image:', isMainImage);
    
    if (isMainImage) {
      console.log('Cannot delete main design image');
      toast({
        title: "Cannot Delete",
        description: "The main image cannot be deleted as it's the core design. You can only delete additional images.",
        variant: "destructive",
      });
      return;
    }
    
    // Remove the image by index
    const filteredImages = images.filter((_, i) => i !== index);
    console.log('Images after filtering by index:', filteredImages.length);
    
    // Reorder the remaining images, preserving the main image at position 1
    const reorderedImages = filteredImages.map((img, newIndex) => {
      if (img.sortOrder === 1) {
        // Keep main image at sortOrder 1
        return img;
      } else {
        // Reorder additional images starting from 2
        const mainImageExists = filteredImages.some(i => i.sortOrder === 1);
        const newSortOrder = mainImageExists ? newIndex + 1 : newIndex + 1;
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
    console.log('=== IMAGE REMOVAL BY INDEX DEBUG END ===');
    
    onImagesUpdate(reorderedImages);
    
    toast({
      title: "Image Removed",
      description: "Additional image has been removed from the product",
    });
  };

  const updateImageAltText = (index: number, altText: string) => {
    console.log('Updating alt text for index:', index, 'to:', altText);
    
    if (index < 0 || index >= images.length) {
      console.error('Invalid index for alt text update:', index);
      return;
    }
    
    const imageToUpdate = images[index];
    
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
    
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, altText } : img
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
