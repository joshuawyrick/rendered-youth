
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
      console.log('=== FEATURED: Starting design-first query fetch ===');
      
      // Design-first query - get the 4 newest published designs that have products
      const { data: designs, error: designsError } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          file_url,
          user_id,
          created_at,
          profiles!inner (
            id,
            first_name,
            last_name,
            age_bracket
          ),
          products!inner (
            id,
            title,
            base_price,
            price,
            collection_id,
            status,
            product_variants (
              id,
              size,
              color,
              price_adjustment,
              is_available
            )
          )
        `)
        .eq('status', 'published')
        .eq('products.status', 'active')
        .order('created_at', { ascending: false })
        .limit(4);

      console.log('Featured designs query result:', designs);
      console.log('Featured designs query error:', designsError);

      if (designsError) {
        console.error('Error fetching featured designs:', designsError);
        setLoading(false);
        return;
      }

      if (!designs || designs.length === 0) {
        console.log('No featured designs found');
        setLoading(false);
        return;
      }

      // Format designs for display - using the first product if multiple exist
      const formattedProducts: FeaturedProduct[] = designs.map((design: any) => {
        const profile = design.profiles;
        const product = Array.isArray(design.products) ? design.products[0] : design.products;
        
        return {
          id: product.id, // Use product ID for navigation
          title: design.title, // Use design title
          slug: design.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Young Creator',
          creatorAge: profile?.age_bracket || 'Unknown',
          creatorState: 'Unknown', // This could be added to profiles table if needed
          creatorUserId: design.user_id,
          imageUrl: design.file_url,
          collectionId: product.collection_id,
          design: {
            file_url: design.file_url
          },
          variants: product.product_variants || []
        };
      });

      console.log('Final formatted featured designs:', formattedProducts);
      console.log('=== FEATURED: Design-first fetch complete ===');
      
      setFeaturedProducts(formattedProducts);
    } catch (error) {
      console.error('Error in design-first fetchFeaturedProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    featuredProducts,
    loading
  };
};
