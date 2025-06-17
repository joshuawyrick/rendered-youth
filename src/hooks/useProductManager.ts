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
      // First, get designs without products
      const { data: designsData, error: designsError } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          file_url,
          status,
          user_id
        `)
        .eq('status', 'published')
        .not('id', 'in', `(SELECT design_id FROM products WHERE design_id IS NOT NULL)`);

      if (designsError) {
        console.error('Designs query error:', designsError);
        throw designsError;
      }

      // Get profiles for designs
      const designUserIds = (designsData || []).map(design => design.user_id);
      const { data: designProfilesData, error: designProfilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', designUserIds);

      if (designProfilesError) {
        console.error('Design profiles query error:', designProfilesError);
        throw designProfilesError;
      }

      // Combine designs with profiles
      const validDesigns: Design[] = (designsData || [])
        .map(design => {
          const profile = designProfilesData?.find(p => p.id === design.user_id);
          return profile ? {
            ...design,
            profiles: {
              first_name: profile.first_name,
              last_name: profile.last_name
            }
          } : null;
        })
        .filter((design): design is Design => design !== null);

      // Get products with designs
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
          designs (
            title,
            file_url,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products query error:', productsError);
        throw productsError;
      }

      // Get profiles for products
      const productUserIds = (productsData || [])
        .filter(product => product.designs)
        .map(product => product.designs!.user_id);
      
      const { data: productProfilesData, error: productProfilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', productUserIds);

      if (productProfilesError) {
        console.error('Product profiles query error:', productProfilesError);
        throw productProfilesError;
      }

      // Combine products with profiles
      const validProducts: Product[] = (productsData || [])
        .map(product => {
          if (!product.designs) return null;
          const profile = productProfilesData?.find(p => p.id === product.designs!.user_id);
          return profile ? {
            ...product,
            designs: {
              ...product.designs,
              profiles: {
                first_name: profile.first_name,
                last_name: profile.last_name
              }
            }
          } : null;
        })
        .filter((product): product is Product => product !== null);

      setAvailableDesigns(validDesigns);
      setProducts(validProducts);
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
