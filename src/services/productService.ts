
import { supabase } from '@/integrations/supabase/client';
import type { Design, Product } from '@/components/admin/product/types';

export const fetchDesignsWithProfiles = async (): Promise<Design[]> => {
  console.log('Fetching designs with profiles...');
  
  const { data: designs, error } = await supabase
    .from('designs')
    .select(`
      id,
      title,
      file_url,
      status,
      user_id
    `)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching designs:', error);
    throw error;
  }

  console.log('Raw designs from database:', designs);

  // Get existing products to filter out designs that already have products
  const { data: existingProducts, error: productsError } = await supabase
    .from('products')
    .select('design_id');

  if (productsError) {
    console.error('Error fetching existing products:', productsError);
    throw productsError;
  }

  console.log('Existing products:', existingProducts);

  const existingDesignIds = existingProducts?.map(p => p.design_id) || [];
  
  // Filter out designs that already have products
  const availableDesigns = designs?.filter(design => 
    !existingDesignIds.includes(design.id)
  ) || [];

  console.log('Available designs after filtering:', availableDesigns);

  // Get profiles for the available designs
  const userIds = [...new Set(availableDesigns.map(d => d.user_id))];
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  console.log('Design profiles:', profiles);

  // Combine designs with profiles
  const designsWithProfiles = availableDesigns.map(design => ({
    ...design,
    profiles: profiles?.find(p => p.id === design.user_id) || {
      first_name: 'Unknown',
      last_name: 'User'
    }
  }));

  console.log('Final available designs:', designsWithProfiles);
  return designsWithProfiles;
};

export const fetchProductsWithDesigns = async (): Promise<Product[]> => {
  // Use the working implementation from productQueryService
  const { fetchProductsWithDesigns: queryServiceFetch } = await import('./productQueryService');
  return queryServiceFetch();
};

export const createProductFromDesign = async (design: Design) => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      title: design.title,
      design_id: design.id,
      price: 25.00,
      base_price: 25.00,
      status: 'active',
      creator_commission_rate: 0.15
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data;
};

export const updateProductStatus = async (productId: string, status: string) => {
  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', productId);

  if (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};

export const fetchProductsForStore = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      base_price,
      price,
      status,
      collection_id,
      designs (
        file_url,
        profiles (
          first_name,
          last_name,
          age_bracket
        )
      ),
      collections (
        name,
        slug
      ),
      product_variants (
        id,
        size,
        color,
        price_adjustment,
        is_available
      )
    `)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }

  return data || [];
};
