
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Heart, Star } from 'lucide-react';

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
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Gray'];

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      // Convert slug back to title for search
      const searchTitle = slug?.replace(/-/g, ' ') || '';
      
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
            profiles!designs_user_id_fkey (
              first_name,
              last_name,
              age_bracket
            )
          )
        `)
        .ilike('title', `%${searchTitle}%`)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={product.designs.file_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Additional product images could go here */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg">
                    <img
                      src={product.designs.file_url}
                      alt={`${product.title} view ${i}`}
                      className="w-full h-full object-cover rounded-lg opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Creator */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-ry-black mb-2">
                  {product.title}
                </h1>
                <p className="text-lg text-gray-600">
                  Created by {product.designs.profiles?.first_name} {product.designs.profiles?.last_name}
                  {product.designs.profiles?.age_bracket && (
                    <span className="ml-2 px-2 py-1 bg-ry-yellow text-ry-black text-sm rounded-full">
                      Age {product.designs.profiles.age_bracket}
                    </span>
                  )}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-ry-black">
                  ${Number(product.price).toFixed(2)}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-gray-600 ml-2">(42 reviews)</span>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-ry-black mb-3">Size</h3>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-ry-black mb-3">Color</h3>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <RYButton
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  className="w-full text-lg py-4"
                >
                  Buy Now - ${Number(product.price).toFixed(2)}
                </RYButton>
                
                <div className="flex gap-3">
                  <RYButton
                    variant="secondary"
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </RYButton>
                  
                  <RYButton
                    variant="outline"
                    size="lg"
                    className="px-4"
                  >
                    <Heart className="h-5 w-5" />
                  </RYButton>
                </div>
              </div>

              {/* Product Info */}
              <RYCard className="p-6">
                <h3 className="text-lg font-semibold text-ry-black mb-4">Product Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p>• 100% Cotton</p>
                  <p>• Machine washable</p>
                  <p>• Printed with eco-friendly inks</p>
                  <p>• Supporting young artists</p>
                  <p>• High-quality screen printing</p>
                </div>
              </RYCard>

              {/* Creator Support Message */}
              <RYCard className="p-6 bg-yellow-50 border-yellow-200">
                <h3 className="text-lg font-semibold text-ry-black mb-2">
                  Supporting Young Artists 🎨
                </h3>
                <p className="text-gray-700">
                  By purchasing this design, you're directly supporting{' '}
                  {product.designs.profiles?.first_name} and helping young artists 
                  turn their creativity into income. 70% of your purchase goes 
                  directly to the creator!
                </p>
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
