
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Design {
  id: string;
  title: string;
  status: string;
  file_url: string;
  collection_id: string | null;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

export const useTuckersTeesManager = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [tuckersDesigns, setTuckersDesigns] = useState<Design[]>([]);
  const [tuckersCollection, setTuckersCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const { toast } = useToast();

  const ensureTuckersCollection = async () => {
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

  const fetchData = async () => {
    try {
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

      if (collection) {
        setTuckersCollection(collection);
        
        const tuckersDesigns = designsWithProfiles.filter(d => d.collection_id === collection.id);
        const otherDesigns = designsWithProfiles.filter(d => d.collection_id !== collection.id);
        
        setTuckersDesigns(tuckersDesigns);
        setDesigns(otherDesigns);
      } else {
        setDesigns(designsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load designs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignToTuckers = async (designId: string) => {
    if (!tuckersCollection) return;

    setAssigning(designId);
    try {
      const { error } = await supabase
        .from('designs')
        .update({ collection_id: tuckersCollection.id })
        .eq('id', designId);

      if (error) throw error;

      const designToMove = designs.find(d => d.id === designId);
      if (designToMove) {
        setDesigns(prev => prev.filter(d => d.id !== designId));
        setTuckersDesigns(prev => [...prev, { ...designToMove, collection_id: tuckersCollection.id }]);
      }

      toast({
        title: "Success",
        description: "Design added to Tucker's Tees collection",
      });
    } catch (error) {
      console.error('Error assigning design:', error);
      toast({
        title: "Error",
        description: "Failed to assign design to Tucker's collection",
        variant: "destructive",
      });
    } finally {
      setAssigning(null);
    }
  };

  const removeFromTuckers = async (designId: string) => {
    setAssigning(designId);
    try {
      const { error } = await supabase
        .from('designs')
        .update({ collection_id: null })
        .eq('id', designId);

      if (error) throw error;

      const designToMove = tuckersDesigns.find(d => d.id === designId);
      if (designToMove) {
        setTuckersDesigns(prev => prev.filter(d => d.id !== designId));
        setDesigns(prev => [...prev, { ...designToMove, collection_id: null }]);
      }

      toast({
        title: "Success",
        description: "Design removed from Tucker's Tees collection",
      });
    } catch (error) {
      console.error('Error removing design:', error);
      toast({
        title: "Error",
        description: "Failed to remove design from Tucker's collection",
        variant: "destructive",
      });
    } finally {
      setAssigning(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    designs,
    tuckersDesigns,
    tuckersCollection,
    loading,
    assigning,
    assignToTuckers,
    removeFromTuckers
  };
};
