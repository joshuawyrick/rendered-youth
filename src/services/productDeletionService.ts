
import { supabase } from '@/integrations/supabase/client';

const isStorageUrl = (url: string): boolean => {
  return url.includes('supabase') && url.includes('storage');
};

const extractStoragePathFromUrl = (url: string): string | null => {
  try {
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

export const deleteEntireProduct = async (productId: string): Promise<void> => {
  console.log('=== DELETE ENTIRE PRODUCT DEBUG START ===');
  console.log('Deleting product:', productId);

  if (!productId) {
    throw new Error('Product ID is required for deletion');
  }

  try {
    // First, get all the product data including images and design
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select(`
        id,
        title,
        additional_images,
        designs (
          id,
          file_url,
          title
        )
      `)
      .eq('id', productId)
      .single();

    if (fetchError) {
      console.error('Error fetching product for deletion:', fetchError);
      throw new Error(`Failed to fetch product: ${fetchError.message}`);
    }

    if (!product) {
      throw new Error('Product not found');
    }

    console.log('Product to delete:', {
      id: product.id,
      title: product.title,
      mainDesignUrl: product.designs?.file_url?.substring(0, 50) + '...',
      additionalImagesCount: Array.isArray(product.additional_images) ? product.additional_images.length : 0
    });

    // Delete additional images from storage
    if (product.additional_images && Array.isArray(product.additional_images)) {
      console.log('Deleting additional images from storage...');
      for (const img of product.additional_images) {
        if (typeof img === 'string') {
          await deleteStorageFile(img);
        } else if (img && typeof img === 'object' && 'url' in img) {
          const imageUrl = (img as { url: string }).url;
          if (imageUrl) {
            await deleteStorageFile(imageUrl);
          }
        }
      }
    }

    // Delete main design image from storage
    if (product.designs?.file_url) {
      console.log('Deleting main design image from storage...');
      await deleteStorageFile(product.designs.file_url);
    }

    // Delete product variants first
    console.log('Deleting product variants...');
    const { error: variantsError } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId);

    if (variantsError) {
      console.error('Error deleting product variants:', variantsError);
      // Don't throw here, continue with deletion
    }

    // Delete the product record
    console.log('Deleting product record...');
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (productError) {
      console.error('Error deleting product:', productError);
      throw new Error(`Failed to delete product: ${productError.message}`);
    }

    // Finally, delete the design record if it exists
    if (product.designs?.id) {
      console.log('Deleting design record...');
      const { error: designError } = await supabase
        .from('designs')
        .delete()
        .eq('id', product.designs.id);

      if (designError) {
        console.error('Error deleting design:', designError);
        // Don't throw here, the main product is already deleted
      }
    }

    console.log('Successfully deleted entire product and all associated data');
    console.log('=== DELETE ENTIRE PRODUCT DEBUG END ===');
  } catch (error) {
    console.error('Error in deleteEntireProduct:', error);
    throw error;
  }
};
