
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
    
    // Add the main design image first
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

export const saveProductImages = async (productId: string, images: ProductImage[]): Promise<void> => {
  try {
    // Filter out the main design image (sortOrder 1) and save the rest as additional_images
    const additionalImages = images
      .filter(img => img.sortOrder > 1)
      .map(img => ({
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder
      }));

    const { error } = await supabase
      .from('products')
      .update({
        additional_images: additionalImages
      })
      .eq('id', productId);

    if (error) throw error;

    console.log('Successfully saved product images:', { productId, imageCount: additionalImages.length });
  } catch (error) {
    console.error('Error saving product images:', error);
    throw error;
  }
};
