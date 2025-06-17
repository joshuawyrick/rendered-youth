
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Eye, Trash2, Package } from 'lucide-react';

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

      {/* Create Products Tab */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Convert published designs into sellable products
          </p>
          
          {availableDesigns.length === 0 ? (
            <RYCard className="p-8 text-center">
              <p className="text-gray-500">No designs available for product creation</p>
              <p className="text-sm text-gray-400 mt-1">
                All published designs have already been converted to products
              </p>
            </RYCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDesigns.map((design) => (
                <RYCard key={design.id} className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={design.file_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-ry-black">{design.title}</h4>
                    <p className="text-sm text-gray-600">
                      by {design.profiles.first_name} {design.profiles.last_name}
                    </p>
                    
                    <RYButton
                      variant="primary"
                      size="sm"
                      onClick={() => createProduct(design)}
                      disabled={creating === design.id}
                      className="w-full"
                    >
                      {creating === design.id ? (
                        'Creating...'
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Create Product ($25.00)
                        </>
                      )}
                    </RYButton>
                  </div>
                </RYCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manage Products Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Manage existing products and their settings
          </p>
          
          {products.length === 0 ? (
            <RYCard className="p-8 text-center">
              <p className="text-gray-500">No products created yet</p>
            </RYCard>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <RYCard key={product.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img 
                        src={product.designs.file_url} 
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div>
                        <h4 className="font-medium">{product.title}</h4>
                        <p className="text-sm text-gray-600">
                          by {product.designs.profiles.first_name} {product.designs.profiles.last_name}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="font-semibold">${Number(product.price).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Price</p>
                      </div>

                      <div className="text-center">
                        <p className="font-semibold">{(product.creator_commission_rate * 100).toFixed(0)}%</p>
                        <p className="text-xs text-gray-500">Commission</p>
                      </div>

                      <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status}
                        </span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <RYButton
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/store/${product.title.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </RYButton>
                        <RYButton
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProductStatus(product)}
                        >
                          {product.status === 'active' ? 'Deactivate' : 'Activate'}
                        </RYButton>
                      </div>
                    </div>
                  </div>
                </RYCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManager;
