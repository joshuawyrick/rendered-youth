
import { supabase } from '@/integrations/supabase/client';
import type { Design } from '@/components/admin/product/types';

export const createProductFromDesign = async (design: Design) => {
  console.log('Creating product from design:', design);
  
  const { error } = await supabase
    .from('products')
    .insert({
      title: design.title,
      design_id: design.id,
      price: 25.00,
      creator_commission_rate: 0.15,
      status: 'active'
    });

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
  
  console.log('Product created successfully');
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
