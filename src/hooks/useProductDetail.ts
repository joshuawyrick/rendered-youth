
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
            profiles!user_id(
              first_name,
              last_name,
              age_bracket
            )
          )
        `)
        .ilike('title', `%${searchTitle}%`)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      
      setProduct(data);
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
