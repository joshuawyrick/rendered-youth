
import { supabase } from '@/integrations/supabase/client';
import type { Design, Collection } from '@/types/tuckersTeesTypes';

export const ensureTuckersCollection = async (): Promise<void> => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', 'tuckers-tees')
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (!existing) {
      const { error: createError } = await supabase
        .from('collections')
        .insert({
          name: "Tucker's Tees",
          description: "Special collection from co-founder Tucker",
          slug: 'tuckers-tees',
          is_active: true,
          sort_order: 0
        });

      if (createError) {
        console.error('Error creating Tucker\'s collection:', createError);
      }
    }
  } catch (error) {
    console.error('Error ensuring Tucker\'s collection:', error);
  }
};

export const fetchTuckersData = async () => {
  await ensureTuckersCollection();
  
  const { data: designsData, error: designsError } = await supabase
    .from('designs')
    .select(`
      id, 
      title, 
      status, 
      file_url, 
      collection_id, 
      created_at,
      user_id
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (designsError) throw designsError;

  console.log('Fetched designs:', designsData);

  const userIds = designsData?.map(d => d.user_id).filter(Boolean) || [];
  
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', userIds);

  if (profilesError) {
    console.error('Profiles query error:', profilesError);
  }

  console.log('Fetched profiles:', profilesData);

  const designsWithProfiles = designsData?.map(design => ({
    ...design,
    profiles: profilesData?.find(p => p.id === design.user_id) || {
      first_name: 'Unknown',
      last_name: 'Creator'
    }
  })) || [];

  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id, name, slug')
    .eq('slug', 'tuckers-tees')
    .single();

  if (collectionError && collectionError.code !== 'PGRST116') {
    throw collectionError;
  }

  return {
    designsWithProfiles,
    collection
  };
};

export const assignDesignToTuckers = async (designId: string, collectionId: string) => {
  const { error } = await supabase
    .from('designs')
    .update({ collection_id: collectionId })
    .eq('id', designId);

  if (error) throw error;
};

export const removeDesignFromTuckers = async (designId: string) => {
  const { error } = await supabase
    .from('designs')
    .update({ collection_id: null })
    .eq('id', designId);

  if (error) throw error;
};
