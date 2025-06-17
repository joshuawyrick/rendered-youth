
import React, { useState } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, Plus } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

interface ProductImageManagerProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdate: (images: ProductImage[]) => void;
  readOnly?: boolean;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  productId,
  images,
  onImagesUpdate,
  readOnly = false
}) => {
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
      // Convert file to data URL for immediate use
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
    // Update sort orders
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

  if (readOnly) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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

  return (
    <div className="space-y-4">
      {/* Current Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
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
                onClick={() => removeImage(index)}
                className="p-1 h-6 w-6"
              >
                <X className="w-3 h-3" />
              </RYButton>
            </div>
            <Input
              placeholder="Alt text"
              value={image.altText}
              onChange={(e) => updateImageAltText(index, e.target.value)}
              className="mt-1 text-xs"
            />
          </div>
        ))}
      </div>

      {/* Add New Image */}
      {!isAddingImage ? (
        <RYButton
          variant="outline"
          onClick={() => setIsAddingImage(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </RYButton>
      ) : (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1"
            />
            <RYButton onClick={addImageByUrl} disabled={!newImageUrl.trim()}>
              Add URL
            </RYButton>
            <RYButton
              variant="secondary"
              onClick={() => {
                setIsAddingImage(false);
                setNewImageUrl('');
                removeFile();
              }}
            >
              Cancel
            </RYButton>
          </div>

          {/* File Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? 'border-ry-yellow bg-yellow-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop an image file here, or{' '}
              <label className="text-ry-black underline cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </label>
            </p>
            {file && (
              <div className="mt-2 space-y-2">
                <div className="text-sm text-green-600">
                  File selected: {file.name}
                </div>
                <div className="flex gap-2 justify-center">
                  <RYButton
                    onClick={handleFileUpload}
                    disabled={uploadingFile}
                    size="sm"
                  >
                    {uploadingFile ? 'Adding...' : 'Add File'}
                  </RYButton>
                  <RYButton
                    variant="secondary"
                    size="sm"
                    onClick={removeFile}
                    disabled={uploadingFile}
                  >
                    Remove
                  </RYButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
