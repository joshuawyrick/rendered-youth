
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Design, Product } from '@/components/admin/product/types';

export const useProductManager = () => {
  const [availableDesigns, setAvailableDesigns] = useState<Design[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch published designs without products
      const { data: designsData, error: designsError } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          file_url,
          status,
          user_id,
          profiles!inner (
            first_name,
            last_name
          )
        `)
        .eq('status', 'published')
        .not('id', 'in', `(SELECT design_id FROM products)`);

      if (designsError) throw designsError;

      // Fetch existing products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          status,
          creator_commission_rate,
          created_at,
          design_id,
          designs!inner (
            title,
            file_url,
            user_id,
            profiles!inner (
              first_name,
              last_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setAvailableDesigns(designsData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (design: Design) => {
    setCreating(design.id);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          title: design.title,
          design_id: design.id,
          price: 25.00,
          creator_commission_rate: 0.15,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setCreating(null);
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(prev => 
        prev.map(p => 
          p.id === product.id 
            ? { ...p, status: newStatus }
            : p
        )
      );

      toast({
        title: "Success",
        description: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  return {
    availableDesigns,
    products,
    loading,
    creating,
    createProduct,
    toggleProductStatus
  };
};
