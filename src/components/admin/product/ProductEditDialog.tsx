
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RYButton } from '@/components/ui/ry-button';
import { RYCard } from '@/components/ui/ry-card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProductImageManager from '@/components/product/ProductImageManager';
import { fetchProductImages, saveProductImages, type ProductImage } from '@/services/productImageService';
import ProductBasicInfoForm from './ProductBasicInfoForm';
import ProductVariantManager from './ProductVariantManager';
import type { Product } from './types';

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

const ProductEditDialog: React.FC<ProductEditDialogProps> = ({
  product,
  open,
  onOpenChange,
  onComplete
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(25.00);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product && open) {
      setTitle(product.title);
      setDescription(product.description || '');
      setBasePrice(Number(product.base_price || product.price));
      fetchProductVariants();
      loadProductImages();
    }
  }, [product, open]);

  const loadProductImages = async () => {
    if (!product) return;
    
    try {
      const productImages = await fetchProductImages(product.id);
      setImages(productImages);
    } catch (error) {
      console.error('Error loading product images:', error);
      // Fallback to design image if available
      if (product.designs?.file_url) {
        setImages([{
          url: product.designs.file_url,
          altText: product.title,
          sortOrder: 1
        }]);
      }
    }
  };

  const fetchProductVariants = async () => {
    if (!product) return;

    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id)
        .order('size', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setVariants(data.map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          priceAdjustment: Number(v.price_adjustment),
          isAvailable: v.is_available
        })));
      } else {
        // Start with empty variants array instead of pre-populating
        setVariants([]);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    }
  };

  const handleSave = async () => {
    if (!product) return;

    setLoading(true);
    try {
      // Update product basic info
      const { error: productError } = await supabase
        .from('products')
        .update({
          title,
          description,
          base_price: basePrice,
          price: basePrice
        })
        .eq('id', product.id);

      if (productError) throw productError;

      // Save product images
      await saveProductImages(product.id, images);

      // Delete existing variants
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', product.id);

      if (deleteError) throw deleteError;

      // Insert new variants
      const variantInserts = variants
        .filter(variant => variant.isAvailable)
        .map(variant => ({
          product_id: product.id,
          variant_type: 'size_color',
          size: variant.size,
          color: variant.color,
          price_adjustment: variant.priceAdjustment,
          is_available: variant.isAvailable
        }));

      if (variantInserts.length > 0) {
        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantInserts);

        if (variantsError) throw variantsError;
      }

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });

      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Product Info */}
          <ProductBasicInfoForm
            title={title}
            description={description}
            basePrice={basePrice}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onBasePriceChange={setBasePrice}
          />

          {/* Product Images */}
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Product Images</h3>
            <ProductImageManager
              productId={product.id}
              images={images}
              onImagesUpdate={setImages}
            />
          </RYCard>

          {/* Product Variants */}
          <ProductVariantManager
            variants={variants}
            basePrice={basePrice}
            onVariantsChange={setVariants}
          />

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <RYButton
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </RYButton>
            <RYButton
              variant="primary"
              onClick={handleSave}
              disabled={loading || !title.trim()}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </RYButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
