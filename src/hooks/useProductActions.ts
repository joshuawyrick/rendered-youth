
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createProductFromDesign, updateProductStatus } from '@/services/productService';
import type { Design, Product } from '@/components/admin/product/types';

export const useProductActions = (onDataChange: () => void, setProducts: (updater: (prev: Product[]) => Product[]) => void) => {
  const [creating, setCreating] = useState<string | null>(null);
  const { toast } = useToast();

  const createProduct = async (design: Design) => {
    setCreating(design.id);
    try {
      await createProductFromDesign(design);

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      onDataChange();
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
      await updateProductStatus(product.id, newStatus);

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
    creating,
    createProduct,
    toggleProductStatus
  };
};
