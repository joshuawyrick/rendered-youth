
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
      console.log('=== FEATURED: Starting optimized single query fetch ===');
      
      // Single optimized query that joins everything at once
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
            status,
            profiles!inner (
              id,
              first_name,
              last_name,
              age_bracket
            )
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

      console.log('Featured products optimized query result:', products);
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

      // Format products for display - now with profile data already included
      const formattedProducts: FeaturedProduct[] = products.map((product: any) => {
        const profile = product.designs?.profiles;
        return {
          id: product.id,
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Young Creator',
          creatorAge: profile?.age_bracket || 'Unknown',
          creatorState: 'Unknown', // This could be added to profiles table if needed
          creatorUserId: product.designs?.user_id || '',
          imageUrl: product.designs?.file_url,
          collectionId: product.collection_id,
          design: {
            file_url: product.designs?.file_url || ''
          },
          variants: product.product_variants || []
        };
      });

      console.log('Final optimized featured products:', formattedProducts);
      console.log('=== FEATURED: Optimized fetch complete ===');
      
      setFeaturedProducts(formattedProducts);
    } catch (error) {
      console.error('Error in optimized fetchFeaturedProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    featuredProducts,
    loading
  };
};
