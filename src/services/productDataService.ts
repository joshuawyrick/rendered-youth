
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/components/admin/product/types';
import { createDefaultProfile } from './profileUtils';

export const fetchProductsWithDesigns = async (): Promise<Product[]> => {
  console.log('Fetching products with designs...');
  
  // Get products with their designs and collections
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select(`
      id, 
      title, 
      description,
      price, 
      base_price,
      status, 
      creator_commission_rate, 
      created_at, 
      design_id,
      collection_id,
      assigned_user_id,
      collections(name, slug)
    `)
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

  // Get assigned user profiles separately
  const assignedUserIds = productsData
    .map(product => product.assigned_user_id)
    .filter(Boolean);
  
  let assignedProfilesData = [];
  if (assignedUserIds.length > 0) {
    const { data: assignedProfiles, error: assignedProfilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', assignedUserIds);

    if (assignedProfilesError) {
      console.error('Assigned profiles query error:', assignedProfilesError);
    } else {
      assignedProfilesData = assignedProfiles || [];
    }
  }

  // Combine products with design and profile data
  const result = productsData
    .map(product => {
      const design = productDesignsData?.find(d => d.id === product.design_id);
      if (!design) {
        console.warn(`No design found for product ${product.id}`);
        return null;
      }
      
      const profile = productProfilesData?.find(p => p.id === design.user_id);
      const assignedProfile = assignedProfilesData.find(p => p.id === product.assigned_user_id);
      
      // If no profile found, create a default one but still include the product
      if (!profile) {
        console.warn(`No profile found for user ${design.user_id}, using default profile`);
        return {
          id: product.id,
          title: product.title,
          description: product.description || '',
          price: product.price,
          base_price: product.base_price,
          status: product.status,
          creator_commission_rate: product.creator_commission_rate,
          created_at: product.created_at,
          design_id: product.design_id,
          collection_id: product.collection_id,
          assigned_user_id: product.assigned_user_id,
          collection_name: product.collections?.name,
          assigned_user_name: assignedProfile ? `${assignedProfile.first_name} ${assignedProfile.last_name}` : null,
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
        description: product.description || '',
        price: product.price,
        base_price: product.base_price,
        status: product.status,
        creator_commission_rate: product.creator_commission_rate,
        created_at: product.created_at,
        design_id: product.design_id,
        collection_id: product.collection_id,
        assigned_user_id: product.assigned_user_id,
        collection_name: product.collections?.name,
        assigned_user_name: assignedProfile ? `${assignedProfile.first_name} ${assignedProfile.last_name}` : null,
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
