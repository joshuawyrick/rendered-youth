
import { supabase } from '@/integrations/supabase/client';
import type { Design, Product } from '@/components/admin/product/types';

export const fetchDesignsWithProfiles = async (): Promise<Design[]> => {
  console.log('Fetching designs with profiles...');
  
  // Get designs that are published
  const { data: designsData, error: designsError } = await supabase
    .from('designs')
    .select('id, title, file_url, status, user_id')
    .eq('status', 'published');

  if (designsError) {
    console.error('Designs query error:', designsError);
    throw designsError;
  }

  console.log('Found published designs:', designsData);

  // Get existing products to filter out designs that already have products
  const { data: existingProducts, error: existingProductsError } = await supabase
    .from('products')
    .select('design_id');

  if (existingProductsError) {
    console.error('Existing products query error:', existingProductsError);
    throw existingProductsError;
  }

  console.log('Existing products:', existingProducts);

  const existingDesignIds = new Set(existingProducts?.map(p => p.design_id) || []);
  const availableDesignsData = (designsData || []).filter(design => !existingDesignIds.has(design.id));

  console.log('Available designs after filtering:', availableDesignsData);

  // Get profiles for available designs
  const designUserIds = availableDesignsData.map(design => design.user_id);
  
  if (designUserIds.length === 0) {
    console.log('No available designs found');
    return [];
  }

  const { data: designProfilesData, error: designProfilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', designUserIds);

  if (designProfilesError) {
    console.error('Design profiles query error:', designProfilesError);
    throw designProfilesError;
  }

  console.log('Design profiles:', designProfilesData);

  // Combine designs with profiles
  const result = availableDesignsData
    .map(design => {
      const profile = designProfilesData?.find(p => p.id === design.user_id);
      if (!profile) {
        console.warn(`No profile found for user ${design.user_id}`);
        return null;
      }
      
      return {
        id: design.id,
        title: design.title,
        file_url: design.file_url,
        status: design.status,
        user_id: design.user_id,
        profiles: {
          first_name: profile.first_name || '',
          last_name: profile.last_name || ''
        }
      };
    })
    .filter((design): design is Design => design !== null);

  console.log('Final available designs:', result);
  return result;
};

export const fetchProductsWithDesigns = async (): Promise<Product[]> => {
  console.log('Fetching products with designs...');
  
  // Get products with their designs
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('id, title, price, status, creator_commission_rate, created_at, design_id')
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error('Products query error:', productsError);
    throw productsError;
  }

  console.log('Found products:', productsData);

  if (!productsData || productsData.length === 0) {
    console.log('No products found');
    return [];
  }

  // Get designs for products
  const productDesignIds = productsData.map(product => product.design_id);
  const { data: productDesignsData, error: productDesignsError } = await supabase
    .from('designs')
    .select('id, title, file_url, user_id')
    .in('id', productDesignIds);

  if (productDesignsError) {
    console.error('Product designs query error:', productDesignsError);
    throw productDesignsError;
  }

  console.log('Product designs:', productDesignsData);

  // Get profiles for product designs
  const productUserIds = (productDesignsData || []).map(design => design.user_id);
  const { data: productProfilesData, error: productProfilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', productUserIds);

  if (productProfilesError) {
    console.error('Product profiles query error:', productProfilesError);
    throw productProfilesError;
  }

  console.log('Product profiles:', productProfilesData);

  // Combine products with design and profile data
  const result = productsData
    .map(product => {
      const design = productDesignsData?.find(d => d.id === product.design_id);
      if (!design) {
        console.warn(`No design found for product ${product.id}`);
        return null;
      }
      
      const profile = productProfilesData?.find(p => p.id === design.user_id);
      if (!profile) {
        console.warn(`No profile found for user ${design.user_id}`);
        return null;
      }
      
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        status: product.status,
        creator_commission_rate: product.creator_commission_rate,
        created_at: product.created_at,
        design_id: product.design_id,
        designs: {
          title: design.title,
          file_url: design.file_url,
          profiles: {
            first_name: profile.first_name || '',
            last_name: profile.last_name || ''
          }
        }
      };
    })
    .filter((product): product is Product => product !== null);

  console.log('Final products with designs:', result);
  return result;
};

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
