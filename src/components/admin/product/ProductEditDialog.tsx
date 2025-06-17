
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RYButton } from '@/components/ui/ry-button';
import { RYCard } from '@/components/ui/ry-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProductImageManager from '@/components/product/ProductImageManager';
import { fetchProductImages, saveProductImages, type ProductImage } from '@/services/productImageService';
import { Plus, Trash2 } from 'lucide-react';
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

const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PREDEFINED_COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Green', 'Blue', 'Purple', 'Yellow', 'Orange', 'Pink', 'Brown'];

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
  const [newVariantSize, setNewVariantSize] = useState('');
  const [newVariantColor, setNewVariantColor] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [customColor, setCustomColor] = useState('');
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

  const addVariant = () => {
    const size = newVariantSize === 'custom' ? customSize : newVariantSize;
    const color = newVariantColor === 'custom' ? customColor : newVariantColor;

    if (!size || !color) {
      toast({
        title: "Error",
        description: "Please select both size and color",
        variant: "destructive",
      });
      return;
    }

    // Check if variant already exists
    const exists = variants.some(v => v.size === size && v.color === color);
    if (exists) {
      toast({
        title: "Error",
        description: "This size and color combination already exists",
        variant: "destructive",
      });
      return;
    }

    const newVariant: ProductVariant = {
      size,
      color,
      priceAdjustment: 0,
      isAvailable: true
    };

    setVariants([...variants, newVariant]);
    setNewVariantSize('');
    setNewVariantColor('');
    setCustomSize('');
    setCustomColor('');
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
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
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                />
              </div>
            </div>
          </RYCard>

          {/* Product Images */}
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Product Images</h3>
            <ProductImageManager
              productId={product.id}
              images={images}
              onImagesUpdate={setImages}
            />
          </RYCard>

          {/* Add New Variant */}
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add Size & Color Variant</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label>Size</Label>
                <Select value={newVariantSize} onValueChange={setNewVariantSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_SIZES.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Size</SelectItem>
                  </SelectContent>
                </Select>
                {newVariantSize === 'custom' && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom size"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                  />
                )}
              </div>
              
              <div>
                <Label>Color</Label>
                <Select value={newVariantColor} onValueChange={setNewVariantColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_COLORS.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Color</SelectItem>
                  </SelectContent>
                </Select>
                {newVariantColor === 'custom' && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                  />
                )}
              </div>
              
              <div className="md:col-span-2">
                <RYButton 
                  onClick={addVariant}
                  className="w-full"
                  disabled={!newVariantSize || !newVariantColor}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </RYButton>
              </div>
            </div>
          </RYCard>

          {/* Product Variants List */}
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Current Variants ({variants.length})</h3>
            {variants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No variants added yet. Use the form above to add size and color combinations.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <div className="grid gap-2">
                  <div className="grid grid-cols-7 gap-2 items-center p-2 bg-gray-50 rounded font-medium">
                    <div>Size</div>
                    <div>Color</div>
                    <div>Price Adj. ($)</div>
                    <div>Final Price</div>
                    <div>Available</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  {variants.map((variant, index) => (
                    <div key={`${variant.size}-${variant.color}`} className="grid grid-cols-7 gap-2 items-center p-2 border rounded">
                      <div className="font-medium">{variant.size}</div>
                      <div>{variant.color}</div>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.priceAdjustment}
                        onChange={(e) => updateVariant(index, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                        className="text-sm"
                      />
                      <div className="text-sm font-medium">
                        ${(basePrice + variant.priceAdjustment).toFixed(2)}
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={variant.isAvailable}
                          onChange={(e) => updateVariant(index, 'isAvailable', e.target.checked)}
                          className="mr-2"
                        />
                      </label>
                      <div className="text-xs text-gray-500">
                        {variant.isAvailable ? 'Active' : 'Disabled'}
                      </div>
                      <RYButton
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </RYButton>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </RYCard>

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
