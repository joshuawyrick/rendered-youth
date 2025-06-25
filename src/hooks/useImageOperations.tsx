
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
    
    // Check if this is the only image
    if (images.length === 1) {
      console.log('Cannot delete the only remaining image');
      toast({
        title: "Cannot Delete",
        description: "You must have at least one product image.",
        variant: "destructive",
      });
      return;
    }
    
    // Remove the image by index
    const filteredImages = images.filter((_, i) => i !== index);
    console.log('Images after filtering by index:', filteredImages.length);
    
    // Reorder the remaining images sequentially
    const reorderedImages = filteredImages.map((img, newIndex) => ({
      ...img,
      sortOrder: newIndex + 1
    }));
    
    console.log('Final reordered images:', reorderedImages.map(img => ({ 
      sortOrder: img.sortOrder, 
      url: img.url.substring(0, 30) + '...' 
    })));
    console.log('=== IMAGE REMOVAL BY INDEX DEBUG END ===');
    
    onImagesUpdate(reorderedImages);
    
    toast({
      title: "Image Removed",
      description: "Image has been removed from the product",
    });
  };

  const updateImageAltText = (index: number, altText: string) => {
    console.log('Updating alt text for index:', index, 'to:', altText);
    
    if (index < 0 || index >= images.length) {
      console.error('Invalid index for alt text update:', index);
      return;
    }
    
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, altText } : img
    );
    onImagesUpdate(updatedImages);
  };

  const reorderImages = (startIndex: number, endIndex: number) => {
    console.log('=== REORDER IMAGES DEBUG START ===');
    console.log('Moving image from index:', startIndex, 'to index:', endIndex);
    
    if (startIndex < 0 || startIndex >= images.length || endIndex < 0 || endIndex >= images.length) {
      console.error('Invalid indices for reordering:', { startIndex, endIndex });
      return;
    }

    const reorderedImages = [...images];
    const [draggedImage] = reorderedImages.splice(startIndex, 1);
    reorderedImages.splice(endIndex, 0, draggedImage);

    // Update sort orders to match new positions
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      sortOrder: index + 1
    }));

    console.log('Reordered images:', updatedImages.map(img => ({ 
      sortOrder: img.sortOrder, 
      url: img.url.substring(0, 30) + '...' 
    })));
    console.log('=== REORDER IMAGES DEBUG END ===');

    onImagesUpdate(updatedImages);
    
    toast({
      title: "Images Reordered",
      description: "Product images have been reordered successfully",
    });
  };

  return {
    addImageByUrl,
    addImageFromFile,
    removeImage,
    updateImageAltText,
    reorderImages
  };
};
