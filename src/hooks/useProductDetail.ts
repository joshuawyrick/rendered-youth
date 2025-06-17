
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { ProductDetail } from '@/components/product/types';

export const useProductDetail = (slug: string | undefined) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      // Convert slug back to title for search
      const searchTitle = slug?.replace(/-/g, ' ') || '';
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          status,
          design_id,
          designs!inner (
            file_url,
            title,
            user_id,
            profiles!inner (
              first_name,
              last_name,
              age_bracket
            )
          )
        `)
        .ilike('title', `%${searchTitle}%`)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      
      // Validate that we have the expected nested data structure
      if (data && data.designs && typeof data.designs === 'object' && 
          data.designs.profiles && typeof data.designs.profiles === 'object' &&
          'first_name' in data.designs.profiles) {
        setProduct(data as ProductDetail);
      } else if (data) {
        console.error('Invalid data structure received:', data);
        throw new Error('Product data is incomplete');
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { product, loading };
};
