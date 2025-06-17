
import { supabase } from '@/integrations/supabase/client';

export const fetchProductsForStore = async () => {
  console.log('Fetching products for store...');
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      base_price,
      price,
      collection_id,
      design_id,
      designs!inner (
        id,
        file_url,
        user_id
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
    .eq('status', 'active')
    .eq('designs.status', 'published');

  if (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }

  // Get user profiles separately to avoid the relationship error
  const designUserIds = (data || []).map(product => product.designs?.user_id).filter(Boolean);
  
  let profilesData = [];
  if (designUserIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, age_bracket')
      .in('id', designUserIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      profilesData = profiles || [];
    }
  }

  // Combine the data
  const enrichedData = (data || []).map(product => {
    const profile = profilesData.find(p => p.id === product.designs?.user_id);
    return {
      ...product,
      designs: {
        ...product.designs,
        profiles: profile || { first_name: 'Unknown', last_name: 'Creator', age_bracket: 'Unknown' }
      }
    };
  });

  console.log('Store products fetched:', enrichedData);
  return enrichedData;
};
