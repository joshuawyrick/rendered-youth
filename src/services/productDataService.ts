
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/components/admin/product/types';
import { createDefaultProfile } from './profileUtils';

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
      
      // If no profile found, create a default one but still include the product
      if (!profile) {
        console.warn(`No profile found for user ${design.user_id}, using default profile`);
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
            profiles: createDefaultProfile()
          }
        };
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
            first_name: profile.first_name || 'Unknown',
            last_name: profile.last_name || 'Creator'
          }
        }
      };
    })
    .filter((product): product is Product => product !== null);

  console.log('Final products with designs:', result);
  return result;
};
