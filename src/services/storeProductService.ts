
import { supabase } from '@/integrations/supabase/client';

export const fetchProductsForStore = async () => {
  console.log('=== STORE: Fetching products for store ===');
  
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
      status,
      designs!inner (
        id,
        file_url,
        user_id,
        status
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

  console.log('Store products query result:', data);
  console.log('Store products query error:', error);

  if (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }

  return formatProductData(data || []);
};

const formatProductData = async (data: any[]) => {
  // Get user profiles separately to avoid relationship errors
  const designUserIds = data.map(product => product.designs?.user_id).filter(Boolean);
  console.log('Design user IDs:', designUserIds);
  
  let profilesData = [];
  if (designUserIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, age_bracket')
      .in('id', designUserIds);

    console.log('Profiles query result:', profiles);
    console.log('Profiles query error:', profilesError);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      profilesData = profiles || [];
    }
  }

  // Combine the data
  const enrichedData = data.map(product => {
    const profile = profilesData.find(p => p.id === product.designs?.user_id);
    return {
      ...product,
      designs: {
        ...product.designs,
        profiles: profile || { first_name: 'Unknown', last_name: 'Creator', age_bracket: 'Unknown' }
      }
    };
  });

  console.log('Final enriched data:', enrichedData);
  console.log('=== END STORE DEBUG ===');
  
  return enrichedData;
};
