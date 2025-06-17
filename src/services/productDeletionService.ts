
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
  console.log('Deleting product:', productId);

  if (!productId) {
    throw new Error('Product ID is required for deletion');
  }

  try {
    // First, get all the product data including images and design
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
      console.error('Error fetching product for deletion:', fetchError);
      throw new Error(`Failed to fetch product: ${fetchError.message}`);
    }

    if (!product) {
      throw new Error('Product not found');
    }

    console.log('Product fetched successfully:', {
      id: product.id,
      title: product.title,
      designId: product.design_id,
      designTitle: product.designs?.title,
      mainDesignUrl: product.designs?.file_url?.substring(0, 50) + '...',
      additionalImagesCount: Array.isArray(product.additional_images) ? product.additional_images.length : 0
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
    }

    // Step 3: Delete main design image from storage
    if (product.designs?.file_url) {
      console.log('Step 3: Deleting main design image from storage...');
      await deleteStorageFile(product.designs.file_url);
    }

    // Step 4: Delete product variants first (due to foreign key constraints)
    console.log('Step 4: Deleting product variants...');
    const { error: variantsError } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', productId);

    if (variantsError) {
      console.error('Error deleting product variants:', variantsError);
      // Don't throw here, continue with deletion
    } else {
      console.log('Product variants deleted successfully');
    }

    // Step 5: Delete printful products if they exist
    console.log('Step 5: Deleting printful products...');
    const { error: printfulError } = await supabase
      .from('printful_products')
      .delete()
      .eq('product_id', productId);

    if (printfulError) {
      console.error('Error deleting printful products:', printfulError);
      // Don't throw here, continue with deletion
    } else {
      console.log('Printful products deleted successfully');
    }

    // Step 6: Delete the product record
    console.log('Step 6: Deleting product record...');
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (productError) {
      console.error('Error deleting product:', productError);
      throw new Error(`Failed to delete product: ${productError.message}`);
    }
    console.log('Product record deleted successfully');

    // Step 7: CRITICAL - Delete the design record completely
    if (product.design_id) {
      console.log('Step 7: Deleting design record completely...');
      console.log('Design ID to delete:', product.design_id);
      
      // First check if design exists
      const { data: designCheck, error: designCheckError } = await supabase
        .from('designs')
        .select('id, title')
        .eq('id', product.design_id)
        .single();

      if (designCheckError) {
        console.error('Error checking design existence:', designCheckError);
      } else if (designCheck) {
        console.log('Design found, proceeding with deletion:', designCheck);
        
        const { error: designError } = await supabase
          .from('designs')
          .delete()
          .eq('id', product.design_id);

        if (designError) {
          console.error('Error deleting design:', designError);
          throw new Error(`Failed to delete design: ${designError.message}`);
        }
        
        // Verify design was actually deleted
        const { data: verifyDeleted, error: verifyError } = await supabase
          .from('designs')
          .select('id')
          .eq('id', product.design_id)
          .maybeSingle();

        if (verifyError) {
          console.error('Error verifying design deletion:', verifyError);
        } else if (verifyDeleted) {
          console.error('CRITICAL: Design was NOT deleted!', verifyDeleted);
          throw new Error('Design deletion failed - record still exists');
        } else {
          console.log('✅ Design successfully deleted and verified');
        }
      } else {
        console.log('Design not found, may have been already deleted');
      }
    }

    console.log('✅ Successfully deleted entire product and all associated data INCLUDING the design');
    console.log('=== DELETE ENTIRE PRODUCT END ===');
  } catch (error) {
    console.error('❌ Error in deleteEntireProduct:', error);
    throw error;
  }
};
