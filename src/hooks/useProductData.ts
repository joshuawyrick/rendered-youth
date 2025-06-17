
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchDesignsWithProfiles, fetchProductsWithDesigns } from '@/services/productService';
import type { Design, Product } from '@/components/admin/product/types';

export const useProductData = () => {
  const [availableDesigns, setAvailableDesigns] = useState<Design[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    console.log('useProductData: Starting COMPLETE FRESH data fetch...');
    setLoading(true);
    
    try {
      // AGGRESSIVELY clear existing data first
      setAvailableDesigns([]);
      setProducts([]);
      
      // Add a longer delay to ensure state is cleared and database changes are reflected
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const [designs, productsData] = await Promise.all([
        fetchDesignsWithProfiles(),
        fetchProductsWithDesigns()
      ]);

      console.log('useProductData: Fresh fetched designs count:', designs.length);
      console.log('useProductData: Fresh fetched products count:', productsData.length);
      console.log('useProductData: Fresh design IDs:', designs.map(d => ({ id: d.id, title: d.title, status: d.status })));
      console.log('useProductData: Fresh product design IDs:', productsData.map(p => ({ id: p.id, title: p.title, design_id: p.design_id })));

      setAvailableDesigns(designs);
      setProducts(productsData);
    } catch (error) {
      console.error('useProductData: Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    availableDesigns,
    products,
    loading,
    fetchData,
    setProducts
  };
};
