
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

interface UseProductImageManagerProps {
  images: ProductImage[];
  onImagesUpdate: (images: ProductImage[]) => void;
}

export const useProductImageManager = ({ images, onImagesUpdate }: UseProductImageManagerProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toast } = useToast();
  const { file, dragActive, handleDrag, handleDrop, handleFileInput, removeFile } = useFileUpload();

  const addImageByUrl = () => {
    if (!newImageUrl.trim()) return;

    const newImage: ProductImage = {
      url: newImageUrl,
      altText: `Product image ${images.length + 1}`,
      sortOrder: images.length + 1
    };

    onImagesUpdate([...images, newImage]);
    setNewImageUrl('');
    setIsAddingImage(false);
    
    toast({
      title: "Image Added",
      description: "New image has been added to the product",
    });
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setUploadingFile(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        const newImage: ProductImage = {
          url: dataUrl,
          altText: `${file.name}`,
          sortOrder: images.length + 1
        };

        onImagesUpdate([...images, newImage]);
        removeFile();
        setIsAddingImage(false);
        
        toast({
          title: "Image Uploaded",
          description: "File has been added to the product",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload the image file",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      sortOrder: i + 1
    }));
    onImagesUpdate(reorderedImages);
    
    toast({
      title: "Image Removed",
      description: "Image has been removed from the product",
    });
  };

  const updateImageAltText = (index: number, altText: string) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], altText };
    onImagesUpdate(updatedImages);
  };

  const cancelAdding = () => {
    setIsAddingImage(false);
    setNewImageUrl('');
    removeFile();
  };

  return {
    newImageUrl,
    setNewImageUrl,
    isAddingImage,
    setIsAddingImage,
    uploadingFile,
    file,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    addImageByUrl,
    handleFileUpload,
    removeImage,
    updateImageAltText,
    cancelAdding
  };
};
