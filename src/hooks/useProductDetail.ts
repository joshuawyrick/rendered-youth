
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
      
      // First, get the product with design
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          status,
          design_id,
          designs (
            file_url,
            title,
            user_id
          )
        `)
        .ilike('title', `%${searchTitle}%`)
        .eq('status', 'active')
        .maybeSingle();

      if (productError) {
        console.error('Error fetching product:', productError);
        throw productError;
      }

      if (!productData || !productData.designs) {
        throw new Error('Product not found');
      }

      // Then get the profile data separately
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, age_bracket')
        .eq('id', productData.designs.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Combine the data
      const combinedProduct: ProductDetail = {
        id: productData.id,
        title: productData.title,
        price: productData.price,
        status: productData.status,
        design_id: productData.design_id,
        designs: {
          file_url: productData.designs.file_url,
          title: productData.designs.title,
          user_id: productData.designs.user_id,
          profiles: {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            age_bracket: profileData.age_bracket
          }
        }
      };

      setProduct(combinedProduct);
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
