
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
  console.log('=== DELETE ENTIRE PRODUCT START ===');
  console.log('Product ID to delete:', productId);

  if (!productId) {
    const error = new Error('Product ID is required for deletion');
    console.error('❌ ERROR:', error.message);
    throw error;
  }

  try {
    // Step 1: Get all the product data including images and design
    console.log('Step 1: Fetching product data...');
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select(`
        id,
        title,
        additional_images,
        design_id,
        designs (
          id,
          file_url,
          title
        )
      `)
      .eq('id', productId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching product for deletion:', fetchError);
      throw new Error(`Failed to fetch product: ${fetchError.message}`);
    }

    if (!product) {
      const error = new Error('Product not found');
      console.error('❌ ERROR:', error.message);
      throw error;
    }

    console.log('✅ Product fetched successfully:', {
      id: product.id,
      title: product.title,
      designId: product.design_id,
      designTitle: product.designs?.title
    });

    // Step 2: Delete additional images from storage
    if (product.additional_images && Array.isArray(product.additional_images)) {
      console.log('Step 2: Deleting additional images from storage...');
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
      console.log('✅ Additional images processed');
    }

    // Step 3: Delete main design image from storage
    if (product.designs?.file_url) {
      console.log('Step 3: Deleting main design image from storage...');
      await deleteStorageFile(product.designs.file_url);
      console.log('✅ Main design image processed');
    }

    // Step 4: Delete related records in dependency order
    console.log('Step 4: Deleting related records...');
    
    // Delete product variants
    const { error: variantsError } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId);

    if (variantsError) {
      console.error('⚠️ Error deleting product variants (continuing):', variantsError);
    } else {
      console.log('✅ Product variants deleted');
    }

    // Delete printful products
    const { error: printfulError } = await supabase
      .from('printful_products')
      .delete()
      .eq('product_id', productId);

    if (printfulError) {
      console.error('⚠️ Error deleting printful products (continuing):', printfulError);
    } else {
      console.log('✅ Printful products deleted');
    }

    // Step 5: Delete the product record
    console.log('Step 5: Deleting product record...');
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (productError) {
      console.error('❌ Error deleting product:', productError);
      throw new Error(`Failed to delete product: ${productError.message}`);
    }
    console.log('✅ Product record deleted');

    // Step 6: Delete the design record
    if (product.design_id) {
      console.log('Step 6: Deleting design record...');
      
      const { error: designError } = await supabase
        .from('designs')
        .delete()
        .eq('id', product.design_id);

      if (designError) {
        console.error('❌ Error deleting design:', designError);
        throw new Error(`Failed to delete design: ${designError.message}`);
      }
      
      console.log('✅ Design record deleted');
    }

    console.log('🎉 DELETION COMPLETED SUCCESSFULLY');
    console.log('=== DELETE ENTIRE PRODUCT END ===');

  } catch (error) {
    console.error('❌ CRITICAL ERROR in deleteEntireProduct:', error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Product deletion failed: ${error.message}`);
    } else {
      throw new Error('Product deletion failed: Unknown error occurred');
    }
  }
};
