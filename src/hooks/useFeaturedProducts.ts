
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
      // Fetch recent active products with designs
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

      if (productsError) {
        console.error('Error fetching featured products:', productsError);
        setLoading(false);
        return;
      }

      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      // Get creator profiles
      const designUserIds = products.map(product => product.designs?.user_id).filter(Boolean);
      let profilesData = [];
      
      if (designUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, age_bracket')
          .in('id', designUserIds);

        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Format products for display
      const formattedProducts: FeaturedProduct[] = products.map((product: any) => {
        const profile = profilesData.find(p => p.id === product.designs?.user_id);
        return {
          id: product.id,
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Young Creator',
          creatorAge: profile?.age_bracket || 'Unknown',
          creatorState: 'Unknown',
          creatorUserId: product.designs?.user_id || '',
          imageUrl: product.designs?.file_url,
          collectionId: product.collection_id,
          design: {
            file_url: product.designs?.file_url || ''
          },
          variants: product.product_variants || []
        };
      });

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
