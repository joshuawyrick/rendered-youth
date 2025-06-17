
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/use-toast';
import { useProductDetail } from '@/hooks/useProductDetail';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductOptions from '@/components/product/ProductOptions';
import ProductActions from '@/components/product/ProductActions';
import ProductDetails from '@/components/product/ProductDetails';
import DiscountCode from '@/components/product/DiscountCode';
import OrderSummary from '@/components/product/OrderSummary';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [variantAdjustment, setVariantAdjustment] = useState(0);
  const [discount, setDiscount] = useState<{ code: string; amount: number; type: 'percentage' | 'fixed' } | undefined>();
  const { toast } = useToast();
  
  const { product, loading } = useProductDetail(slug);

  // Initialize size, color, and price when product loads
  useEffect(() => {
    if (product && product.product_variants.length > 0) {
      const firstAvailableVariant = product.product_variants.find(v => v.is_available);
      if (firstAvailableVariant) {
        setSelectedSize(firstAvailableVariant.size);
        setSelectedColor(firstAvailableVariant.color);
        setVariantAdjustment(firstAvailableVariant.price_adjustment);
      }
      setCurrentPrice(product.base_price || product.price);
    } else if (product) {
      // No variants, use base product
      setCurrentPrice(product.base_price || product.price);
      setSelectedSize('One Size');
      setSelectedColor('Default');
    }
  }, [product]);

  const handlePriceChange = (basePrice: number, adjustment: number) => {
    setVariantAdjustment(adjustment);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Added to cart!",
      description: `${product?.title} in ${selectedSize} (${selectedColor}) added to your cart`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select size and color before checkout",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Redirecting to checkout",
      description: "Taking you to secure checkout...",
    });
  };

  const handleDiscountApplied = (discountInfo: { code: string; amount: number; type: 'percentage' | 'fixed' }) => {
    setDiscount(discountInfo);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-ry-black mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = currentPrice + variantAdjustment;

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Images */}
            <div className="lg:col-span-1">
              <ProductImageGallery 
                imageUrl={product.designs.file_url}
                title={product.title}
              />
            </div>

            {/* Middle Column - Product Info */}
            <div className="lg:col-span-1 space-y-6">
              <ProductInfo product={product} />
              
              <ProductOptions
                variants={product.product_variants}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
                onPriceChange={handlePriceChange}
              />

              <ProductActions
                price={finalPrice}
                productTitle={product.title}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />

              <ProductDetails product={product} />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <OrderSummary
                basePrice={currentPrice}
                variantAdjustment={variantAdjustment}
                discount={discount}
                shipping={0} // Free shipping for now
                tax={0} // Tax calculation can be added later
              />
              
              <DiscountCode onDiscountApplied={handleDiscountApplied} />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
