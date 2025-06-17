
import { supabase } from '@/integrations/supabase/client';

export interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

// We'll store images in the products table as a JSON array for now
// In the future, this could be moved to a dedicated product_images table

export const fetchProductImages = async (productId: string): Promise<ProductImage[]> => {
  try {
    // Get the main design image from the product and any additional images
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        additional_images,
        designs (
          file_url,
          title
        )
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;

    const images: ProductImage[] = [];
    
    // Add the main design image first (only if it exists)
    if (product?.designs?.file_url) {
      images.push({
        url: product.designs.file_url,
        altText: product.designs.title || 'Product image',
        sortOrder: 1
      });
    }

    // Add any additional images stored in the product
    if (product?.additional_images && Array.isArray(product.additional_images)) {
      const additionalImages = product.additional_images.map((img: any, index: number) => ({
        url: img.url || img,
        altText: img.altText || `Product image ${index + 2}`,
        sortOrder: index + 2
      }));
      images.push(...additionalImages);
    }

    return images.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};

const isStorageUrl = (url: string): boolean => {
  return url.includes('supabase') && url.includes('storage');
};

const extractStoragePathFromUrl = (url: string): string | null => {
  try {
    // Extract the path after /storage/v1/object/public/{bucket}/
    const match = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting storage path:', error);
    return null;
  }
};

const deleteStorageFile = async (url: string): Promise<void> => {
  if (!isStorageUrl(url)) {
    console.log('Skipping deletion of non-storage URL:', url);
    return;
  }

  const filePath = extractStoragePathFromUrl(url);
  if (!filePath) {
    console.error('Could not extract file path from URL:', url);
    return;
  }

  try {
    const { error } = await supabase.storage
      .from('design-uploads')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file from storage:', error);
    } else {
      console.log('Successfully deleted file from storage:', filePath);
    }
  } catch (error) {
    console.error('Error during file deletion:', error);
  }
};

export const saveProductImages = async (productId: string, images: ProductImage[], previousImages: ProductImage[] = []): Promise<void> => {
  try {
    console.log('=== SAVE IMAGES DEBUG ===');
    console.log('Product ID:', productId);
    console.log('Current images:', images.map(img => ({ sortOrder: img.sortOrder, url: img.url.substring(0, 50) + '...' })));
    console.log('Previous images:', previousImages.map(img => ({ sortOrder: img.sortOrder, url: img.url.substring(0, 50) + '...' })));

    // Get current product data to check the main design
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('designs(file_url)')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    const currentMainDesignUrl = currentProduct?.designs?.file_url;
    console.log('Current main design URL:', currentMainDesignUrl?.substring(0, 50) + '...');

    // Check if the main design image is still present in the new images
    const hasMainDesignInCurrent = images.some(img => img.sortOrder === 1 && img.url === currentMainDesignUrl);
    console.log('Main design still present:', hasMainDesignInCurrent);
    
    // Separate main design image (sortOrder 1) from additional images
    const mainDesignImage = images.find(img => img.sortOrder === 1);
    const additionalImages = images
      .filter(img => img.sortOrder > 1)
      .map(img => ({
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder
      }));

    console.log('Additional images to save:', additionalImages.length);

    // Find images that were removed (existed in previousImages but not in current images)
    const currentUrls = new Set(images.map(img => img.url));
    const removedImages = previousImages.filter(prevImg => !currentUrls.has(prevImg.url));
    console.log('Images to delete:', removedImages.length);

    // Delete removed images from storage
    for (const removedImage of removedImages) {
      console.log('Deleting storage file for:', removedImage.url.substring(0, 50) + '...');
      await deleteStorageFile(removedImage.url);
    }

    // If main design was removed or changed, handle the design update
    if (currentMainDesignUrl && (!hasMainDesignInCurrent || (mainDesignImage && mainDesignImage.url !== currentMainDesignUrl))) {
      // Delete the old main design file if it was removed
      if (!hasMainDesignInCurrent) {
        console.log('Deleting old main design file');
        await deleteStorageFile(currentMainDesignUrl);
      }
    }

    // Update the product with new additional images
    const { error } = await supabase
      .from('products')
      .update({
        additional_images: additionalImages
      })
      .eq('id', productId);

    if (error) throw error;

    console.log('Successfully saved product images:', { 
      productId, 
      imageCount: additionalImages.length,
      removedCount: removedImages.length,
      mainDesignRemoved: currentMainDesignUrl && !hasMainDesignInCurrent
    });
    console.log('=== END SAVE DEBUG ===');
  } catch (error) {
    console.error('Error saving product images:', error);
    throw error;
  }
};
