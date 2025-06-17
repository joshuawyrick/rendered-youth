
import { supabase } from '@/integrations/supabase/client';

export const fetchProductsForStore = async () => {
  console.log('=== STORE DEBUG: Fetching products for store ===');
  
  // First, let's check what products exist
  const { data: allProducts, error: allProductsError } = await supabase
    .from('products')
    .select('id, title, status, design_id');
    
  console.log('All products in database:', allProducts);
  console.log('All products error:', allProductsError);
  
  // Check what designs exist
  const { data: allDesigns, error: allDesignsError } = await supabase
    .from('designs')
    .select('id, title, status, user_id');
    
  console.log('All designs in database:', allDesigns);
  console.log('All designs error:', allDesignsError);
  
  // If no products exist at all, return empty array
  if (!allProducts || allProducts.length === 0) {
    console.log('No products found in database');
    return [];
  }
  
  // Check if any products are active
  const activeProducts = allProducts.filter(p => p.status === 'active');
  console.log('Active products:', activeProducts);
  
  if (activeProducts.length === 0) {
    console.log('No active products found');
    // Let's try to get products regardless of status for testing
    console.log('Attempting to fetch all products regardless of status...');
  }
  
  // Try a more permissive query first to see if we get any data
  const { data: testData, error: testError } = await supabase
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
      designs (
        id,
        file_url,
        user_id,
        status,
        title
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
    .limit(10);

  console.log('Test query (no filters) result:', testData);
  console.log('Test query error:', testError);
  
  // Now try the main query
  console.log('Attempting main store query...');
  
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

  console.log('Main query result:', data);
  console.log('Main query error:', error);

  if (error) {
    console.error('Error fetching store products:', error);
    // If the main query fails, try a fallback without the published design filter
    console.log('Main query failed, trying fallback...');
    
    const { data: fallbackData, error: fallbackError } = await supabase
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
        designs (
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
      .eq('status', 'active');
      
    console.log('Fallback query result:', fallbackData);
    console.log('Fallback query error:', fallbackError);
    
    if (fallbackError) {
      throw fallbackError;
    }
    
    // Use fallback data if available
    if (fallbackData && fallbackData.length > 0) {
      console.log('Using fallback data');
      return formatProductData(fallbackData);
    }
    
    throw error;
  }

  // If we got data from main query, use it
  if (data && data.length > 0) {
    return formatProductData(data);
  }

  // If no data from main query, try without design status filter
  console.log('No data from main query, trying without design status filter...');
  const { data: altData, error: altError } = await supabase
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
      designs (
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
    .eq('status', 'active');

  console.log('Alternative query result:', altData);
  console.log('Alternative query error:', altError);

  if (altError) {
    throw altError;
  }

  return formatProductData(altData || []);
};

const formatProductData = async (data: any[]) => {
  // Get user profiles separately to avoid the relationship error
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
