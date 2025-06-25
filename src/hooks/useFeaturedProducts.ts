
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  creatorName: string;
  creatorAge: string;
  creatorState: string;
  creatorUserId: string;
  imageUrl?: string;
  collectionId?: string;
  design?: {
    file_url: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

export const useFeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      console.log('=== FEATURED: Starting featured products fetch (newest first) ===');
      
      // First, get the 4 newest published products with their designs
      const { data: products, error: productsError } = await supabase
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
          created_at,
          designs!inner (
            id,
            file_url,
            user_id,
            status
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
        .eq('designs.status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);

      console.log('Featured products query result:', products);
      console.log('Featured products query error:', productsError);

      if (productsError) {
        console.error('Error fetching featured products:', productsError);
        setLoading(false);
        return;
      }

      if (!products || products.length === 0) {
        console.log('No featured products found');
        setLoading(false);
        return;
      }

      // Get creator profiles separately to avoid relationship issues
      const designUserIds = products.map(product => product.designs?.user_id).filter(Boolean);
      console.log('Design user IDs for profiles:', designUserIds);
      
      let profilesData = [];
      if (designUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, age_bracket, state')
          .in('id', designUserIds);

        console.log('Profiles query result:', profiles);
        console.log('Profiles query error:', profilesError);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Format products for display with profile data
      const formattedProducts: FeaturedProduct[] = products.map((product: any) => {
        const profile = profilesData.find(p => p.id === product.designs?.user_id);
        
        return {
          id: product.id,
          title: product.title,
          slug: product.id, // Use product ID as slug for reliable routing
          price: Number(product.base_price || product.price),
          creatorName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Young Creator',
          creatorAge: profile?.age_bracket || 'Unknown',
          creatorState: profile?.state || 'Unknown',
          creatorUserId: product.designs?.user_id || '',
          imageUrl: product.designs?.file_url,
          collectionId: product.collection_id,
          design: {
            file_url: product.designs?.file_url || ''
          },
          variants: product.product_variants || []
        };
      });

      console.log('Final formatted featured products (newest first):', formattedProducts);
      console.log('=== FEATURED: Fetch complete ===');
      
      setFeaturedProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchFeaturedProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    featuredProducts,
    loading
  };
};
