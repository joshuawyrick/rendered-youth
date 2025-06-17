
import { supabase } from '@/integrations/supabase/client';
import type { Design } from '@/components/admin/product/types';

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
