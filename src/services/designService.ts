
import { supabase } from '@/integrations/supabase/client';
import type { Design } from '@/components/admin/product/types';
import { createDefaultProfile } from './profileUtils';

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

  // Combine designs with profiles - create default profile if missing
  const result = availableDesignsData
    .map(design => {
      const profile = designProfilesData?.find(p => p.id === design.user_id);
      
      // If no profile found, create a default one but still include the design
      if (!profile) {
        console.warn(`No profile found for user ${design.user_id}, using default profile`);
        return {
          id: design.id,
          title: design.title,
          file_url: design.file_url,
          status: design.status,
          user_id: design.user_id,
          profiles: createDefaultProfile()
        };
      }
      
      return {
        id: design.id,
        title: design.title,
        file_url: design.file_url,
        status: design.status,
        user_id: design.user_id,
        profiles: {
          first_name: profile.first_name || 'Unknown',
          last_name: profile.last_name || 'Creator'
        }
      };
    });

  console.log('Final available designs:', result);
  return result;
};
