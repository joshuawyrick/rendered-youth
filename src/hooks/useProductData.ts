
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
    console.log('useProductData: Starting data fetch...');
    setLoading(true);
    
    try {
      const [designs, productsData] = await Promise.all([
        fetchDesignsWithProfiles(),
        fetchProductsWithDesigns()
      ]);

      console.log('useProductData: Fetched designs:', designs);
      console.log('useProductData: Fetched products:', productsData);

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
