import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Package } from 'lucide-react';
import ProductCreationTab from './product/ProductCreationTab';
import ProductManagementTab from './product/ProductManagementTab';

interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  creator_commission_rate: number;
  created_at: string;
  design_id: string;
  designs: {
    title: string;
    file_url: string;
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

const ProductManager = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
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
          profiles(
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
            profiles(
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5" />
        <h2 className="text-2xl font-semibold text-ry-black">Product Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-ry-yellow text-ry-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Products ({availableDesigns.length})
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-ry-yellow text-ry-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Products ({products.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'create' && (
        <ProductCreationTab
          availableDesigns={availableDesigns}
          creating={creating}
          onCreateProduct={createProduct}
        />
      )}

      {activeTab === 'manage' && (
        <ProductManagementTab
          products={products}
          onToggleProductStatus={toggleProductStatus}
        />
      )}
    </div>
  );
};

export default ProductManager;
