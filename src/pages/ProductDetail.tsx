
import React, { useState } from 'react';
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

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const { toast } = useToast();
  
  const { product, loading } = useProductDetail(slug);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${product?.title} in ${selectedSize} (${selectedColor}) added to your cart`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Redirecting to checkout",
      description: "Taking you to secure checkout...",
    });
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

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductImageGallery 
              imageUrl={product.designs.file_url}
              title={product.title}
            />

            <div className="space-y-6">
              <ProductInfo product={product} />
              
              <ProductOptions
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
              />

              <ProductActions
                price={product.price}
                productTitle={product.title}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />

              <ProductDetails product={product} />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
