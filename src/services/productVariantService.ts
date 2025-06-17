
import { supabase } from '@/integrations/supabase/client';

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_type: string;
  size: string;
  color: string;
  price_adjustment: number;
  is_available: boolean;
  printful_variant_id?: string;
  created_at: string;
}

export const fetchProductVariants = async (productId: string): Promise<ProductVariant[]> => {
  console.log('Fetching variants for product:', productId);
  
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .eq('is_available', true)
    .order('size', { ascending: true });

  if (error) {
    console.error('Error fetching product variants:', error);
    throw error;
  }

  console.log('Product variants:', data);
  return data || [];
};

export const createProductVariants = async (variants: Omit<ProductVariant, 'id' | 'created_at'>[]) => {
  console.log('Creating product variants:', variants);
  
  const { data, error } = await supabase
    .from('product_variants')
    .insert(variants)
    .select();

  if (error) {
    console.error('Error creating product variants:', error);
    throw error;
  }

  console.log('Created variants:', data);
  return data;
};

export const updateProductVariant = async (variantId: string, updates: Partial<ProductVariant>) => {
  console.log('Updating product variant:', variantId, updates);
  
  const { data, error } = await supabase
    .from('product_variants')
    .update(updates)
    .eq('id', variantId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product variant:', error);
    throw error;
  }

  console.log('Updated variant:', data);
  return data;
};

export const deleteProductVariant = async (variantId: string) => {
  console.log('Deleting product variant:', variantId);
  
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId);

  if (error) {
    console.error('Error deleting product variant:', error);
    throw error;
  }

  console.log('Deleted variant successfully');
};
