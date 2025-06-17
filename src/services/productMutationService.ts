
import { supabase } from '@/integrations/supabase/client';
import type { Design } from '@/components/admin/product/types';

export interface ProductCreateData {
  title: string;
  description?: string;
  design_id: string;
  price: number;
  base_price: number;
  creator_commission_rate: number;
  collection_id?: string;
  assigned_user_id?: string;
  status: string;
}

export const createProductFromDesign = async (design: Design) => {
  console.log('Creating product from design:', design);
  
  const { error } = await supabase
    .from('products')
    .insert({
      title: design.title,
      design_id: design.id,
      price: 25.00,
      base_price: 25.00,
      creator_commission_rate: 0.15,
      status: 'active'
    });

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
  
  console.log('Product created successfully');
};

export const createProductWithDetails = async (productData: ProductCreateData) => {
  console.log('Creating product with details:', productData);
  
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product with details:', error);
    throw error;
  }
  
  console.log('Product created with details successfully:', data);
  return data;
};

export const updateProductStatus = async (productId: string, status: string) => {
  console.log('Updating product status:', productId, status);
  
  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', productId);

  if (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
  
  console.log('Product status updated successfully');
};

export const updateProductDetails = async (productId: string, updates: Partial<ProductCreateData>) => {
  console.log('Updating product details:', productId, updates);
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product details:', error);
    throw error;
  }
  
  console.log('Product details updated successfully:', data);
  return data;
};
