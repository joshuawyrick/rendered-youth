
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { Star, Heart, Plus, Eye } from 'lucide-react';

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

const TuckersTeesManager = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [tuckersDesigns, setTuckersDesigns] = useState<Design[]>([]);
  const [tuckersCollection, setTuckersCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // First, ensure Tucker's Tees collection exists
      await ensureTuckersCollection();
      
      // Fetch all published designs not yet assigned to Tucker's collection
      const { data: allDesigns, error: designsError } = await supabase
        .from('designs')
        .select(`
          id, 
          title, 
          status, 
          file_url, 
          collection_id, 
          created_at,
          profiles!inner (first_name, last_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (designsError) throw designsError;

      // Get Tucker's collection
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
        
        // Separate Tucker's designs from other designs
        const tuckersDesigns = allDesigns?.filter(d => d.collection_id === collection.id) || [];
        const otherDesigns = allDesigns?.filter(d => d.collection_id !== collection.id) || [];
        
        setTuckersDesigns(tuckersDesigns);
        setDesigns(otherDesigns);
      } else {
        setDesigns(allDesigns || []);
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

  const ensureTuckersCollection = async () => {
    try {
      // Check if Tucker's Tees collection exists
      const { data: existing, error: checkError } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', 'tuckers-tees')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Create the collection if it doesn't exist
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

  const assignToTuckers = async (designId: string) => {
    if (!tuckersCollection) return;

    setAssigning(designId);
    try {
      const { error } = await supabase
        .from('designs')
        .update({ collection_id: tuckersCollection.id })
        .eq('id', designId);

      if (error) throw error;

      // Move design from available to Tucker's designs
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

      // Move design from Tucker's to available designs
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading Tucker's Tees manager...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Star className="w-6 h-6 text-ry-yellow fill-current" />
        <h2 className="text-2xl font-semibold text-ry-black">Tucker's Tees Collection Manager</h2>
        <Heart className="w-5 h-5 text-red-500 fill-current" />
      </div>

      {/* Tucker's Current Designs */}
      <RYCard className="p-6">
        <h3 className="text-xl font-semibold text-ry-black mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-ry-yellow fill-current" />
          Current Tucker's Tees Designs ({tuckersDesigns.length})
        </h3>
        
        {tuckersDesigns.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No designs in Tucker's Tees collection yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tuckersDesigns.map((design) => (
              <div key={design.id} className="border rounded-lg p-4 bg-ry-yellow/5">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={design.file_url} 
                    alt={design.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.textContent = '🎨';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-4xl hidden">🎨</div>
                </div>
                <h4 className="font-medium text-ry-black mb-1">{design.title}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  By {design.profiles?.first_name} {design.profiles?.last_name}
                </p>
                <RYButton
                  variant="secondary"
                  size="sm"
                  onClick={() => removeFromTuckers(design.id)}
                  disabled={assigning === design.id}
                  className="w-full"
                >
                  {assigning === design.id ? 'Removing...' : 'Remove from Collection'}
                </RYButton>
              </div>
            ))}
          </div>
        )}
      </RYCard>

      {/* Available Designs to Add */}
      <RYCard className="p-6">
        <h3 className="text-xl font-semibold text-ry-black mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Available Designs to Add ({designs.length})
        </h3>
        
        {designs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            All published designs are already assigned to collections
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {designs.map((design) => (
              <div key={design.id} className="border rounded-lg p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={design.file_url} 
                    alt={design.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.textContent = '🎨';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-4xl hidden">🎨</div>
                </div>
                <h4 className="font-medium text-ry-black mb-1">{design.title}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  By {design.profiles?.first_name} {design.profiles?.last_name}
                </p>
                <RYButton
                  onClick={() => assignToTuckers(design.id)}
                  disabled={assigning === design.id}
                  className="w-full bg-ry-yellow hover:bg-ry-yellow/90"
                >
                  {assigning === design.id ? 'Adding...' : 'Add to Tucker\'s Tees'}
                </RYButton>
              </div>
            ))}
          </div>
        )}
      </RYCard>
    </div>
  );
};

export default TuckersTeesManager;
