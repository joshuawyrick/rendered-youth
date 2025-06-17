
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYButton } from '@/components/ui/ry-button';
import { RYCard } from '@/components/ui/ry-card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Heart, Share2, ShoppingCart } from 'lucide-react';

interface ProductDetail {
  id: string;
  title: string;
  price: number;
  status: string;
  design_id: string;
  designs: {
    file_url: string;
    title: string;
    user_id: string;
    profiles: {
      first_name: string;
      last_name: string;
      age_bracket: string;
    };
  };
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      // Convert slug back to title for matching
      const title = slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          status,
          design_id,
          designs!inner (
            file_url,
            title,
            user_id,
            profiles!inner (
              first_name,
              last_name,
              age_bracket
            )
          )
        `)
        .eq('status', 'active')
        .ilike('title', `%${title}%`)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Added to cart:', {
      productId: product?.id,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  const handleBuyNow = () => {
    // TODO: Implement direct checkout
    console.log('Buy now:', {
      productId: product?.id,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ry-yellow mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading product...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-ry-black mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
              <RYButton variant="primary" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </RYButton>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Gray'];

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/store" className="hover:text-ry-black">Store</a>
              <span>/</span>
              <span className="text-ry-black">{product.title}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.designs.file_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail images - placeholder for multiple views */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                    <img
                      src={product.designs.file_url}
                      alt={`${product.title} view ${i}`}
                      className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-ry-black mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-lg text-gray-600">
                    Created by {product.designs.profiles.first_name} {product.designs.profiles.last_name}
                  </p>
                  <Badge variant="secondary">
                    Ages {product.designs.profiles.age_bracket}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-ry-black">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              {/* Product Options */}
              <div className="space-y-6">
                {/* Size Selection */}
                <div>
                  <h3 className="text-sm font-medium text-ry-black mb-3">Size</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 border rounded-lg text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-sm font-medium text-ry-black mb-3">Color</h3>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="text-sm font-medium text-ry-black mb-3">Quantity</h3>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <RYButton
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  className="w-full"
                >
                  Buy Now - ${(Number(product.price) * quantity).toFixed(2)}
                </RYButton>
                
                <RYButton
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </RYButton>

                <div className="flex gap-2">
                  <RYButton variant="outline" size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </RYButton>
                  <RYButton variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </RYButton>
                </div>
              </div>

              {/* Product Details */}
              <RYCard className="p-6">
                <h3 className="font-semibold text-ry-black mb-4">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span>100% Cotton</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fit:</span>
                    <span>Unisex</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Care:</span>
                    <span>Machine wash cold</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin:</span>
                    <span>Made to order</span>
                  </div>
                </div>
              </RYCard>

              {/* Creator Info */}
              <RYCard className="p-6">
                <h3 className="font-semibold text-ry-black mb-4">About the Creator</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ry-yellow rounded-full flex items-center justify-center">
                    <span className="font-bold text-ry-black">
                      {product.designs.profiles.first_name[0]}{product.designs.profiles.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {product.designs.profiles.first_name} {product.designs.profiles.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Young artist, ages {product.designs.profiles.age_bracket}
                    </p>
                  </div>
                </div>
              </RYCard>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
