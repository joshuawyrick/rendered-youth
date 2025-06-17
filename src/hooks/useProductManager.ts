
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
        .select('id, title, file_url, status, user_id')
        .eq('status', 'published');

      if (designsError) {
        console.error('Designs query error:', designsError);
        throw designsError;
      }

      // Get existing products to filter out designs that already have products
      const { data: existingProducts, error: existingProductsError } = await supabase
        .from('products')
        .select('design_id');

      if (existingProductsError) {
        console.error('Existing products query error:', existingProductsError);
        throw existingProductsError;
      }

      const existingDesignIds = new Set(existingProducts?.map(p => p.design_id) || []);
      const availableDesignsData = (designsData || []).filter(design => !existingDesignIds.has(design.id));

      // Get profiles for available designs
      const designUserIds = availableDesignsData.map(design => design.user_id);
      const { data: designProfilesData, error: designProfilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', designUserIds);

      if (designProfilesError) {
        console.error('Design profiles query error:', designProfilesError);
        throw designProfilesError;
      }

      // Combine designs with profiles
      const validDesigns: Design[] = availableDesignsData
        .map(design => {
          const profile = designProfilesData?.find(p => p.id === design.user_id);
          if (!profile) return null;
          
          return {
            id: design.id,
            title: design.title,
            file_url: design.file_url,
            status: design.status,
            user_id: design.user_id,
            profiles: {
              first_name: profile.first_name || '',
              last_name: profile.last_name || ''
            }
          };
        })
        .filter((design): design is Design => design !== null);

      // Get products with their designs
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, title, price, status, creator_commission_rate, created_at, design_id')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products query error:', productsError);
        throw productsError;
      }

      // Get designs for products
      const productDesignIds = (productsData || []).map(product => product.design_id);
      const { data: productDesignsData, error: productDesignsError } = await supabase
        .from('designs')
        .select('id, title, file_url, user_id')
        .in('id', productDesignIds);

      if (productDesignsError) {
        console.error('Product designs query error:', productDesignsError);
        throw productDesignsError;
      }

      // Get profiles for product designs
      const productUserIds = (productDesignsData || []).map(design => design.user_id);
      const { data: productProfilesData, error: productProfilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', productUserIds);

      if (productProfilesError) {
        console.error('Product profiles query error:', productProfilesError);
        throw productProfilesError;
      }

      // Combine products with design and profile data
      const validProducts: Product[] = (productsData || [])
        .map(product => {
          const design = productDesignsData?.find(d => d.id === product.design_id);
          if (!design) return null;
          
          const profile = productProfilesData?.find(p => p.id === design.user_id);
          if (!profile) return null;
          
          return {
            id: product.id,
            title: product.title,
            price: product.price,
            status: product.status,
            creator_commission_rate: product.creator_commission_rate,
            created_at: product.created_at,
            design_id: product.design_id,
            designs: {
              title: design.title,
              file_url: design.file_url,
              profiles: {
                first_name: profile.first_name || '',
                last_name: profile.last_name || ''
              }
            }
          };
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
