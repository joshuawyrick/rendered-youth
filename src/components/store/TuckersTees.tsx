
import React, { useState, useEffect } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Star, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ui/product-card';

interface TuckersProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  creatorName: string;
  creatorAge: string;
  creatorState: string;
  creatorUserId: string;
  imageUrl?: string;
  collectionId?: string;
  design?: {
    file_url: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

const TuckersTees: React.FC = () => {
  const [tuckersProducts, setTuckersProducts] = useState<TuckersProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTuckersProducts();
  }, []);

  const fetchTuckersProducts = async () => {
    try {
      // First get the Tucker's Tees collection
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', 'tuckers-tees')
        .single();

      if (collectionError || !collection) {
        console.log('Tucker\'s Tees collection not found');
        setLoading(false);
        return;
      }

      // Fetch products in Tucker's Tees collection
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          base_price,
          price,
          collection_id,
          design_id,
          status,
          designs!inner (
            id,
            file_url,
            user_id,
            status
          ),
          product_variants (
            id,
            size,
            color,
            price_adjustment,
            is_available
          )
        `)
        .eq('status', 'active')
        .eq('collection_id', collection.id)
        .eq('designs.status', 'published')
        .limit(3); // Show only first 3 products

      if (productsError) {
        console.error('Error fetching Tucker\'s products:', productsError);
        setLoading(false);
        return;
      }

      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      // Get creator profiles
      const designUserIds = products.map(product => product.designs?.user_id).filter(Boolean);
      let profilesData = [];
      
      if (designUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, age_bracket')
          .in('id', designUserIds);

        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Format products for display
      const formattedProducts: TuckersProduct[] = products.map((product: any) => {
        const profile = profilesData.find(p => p.id === product.designs?.user_id);
        return {
          id: product.id,
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Tucker',
          creatorAge: profile?.age_bracket || 'Co-Founder',
          creatorState: 'Unknown',
          creatorUserId: product.designs?.user_id || '',
          imageUrl: product.designs?.file_url,
          collectionId: product.collection_id,
          design: {
            file_url: product.designs?.file_url || ''
          },
          variants: product.product_variants || []
        };
      });

      setTuckersProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchTuckersProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllClick = () => {
    // Filter to show only Tucker's Tees collection products
    const searchParams = new URLSearchParams();
    searchParams.set('collection', 'tuckers-tees');
    window.location.href = `/store?${searchParams.toString()}`;
  };

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-6 h-6 text-ry-yellow fill-current" />
          <h2 className="text-3xl font-bold text-ry-black">Tucker's Tees</h2>
          <Star className="w-6 h-6 text-ry-yellow fill-current" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Special collection from our co-founder Tucker - the original inspiration behind Rendered Youth
        </p>
      </div>

      <RYCard className="bg-gradient-to-br from-ry-yellow/10 to-ry-yellow/5 border-ry-yellow/20 p-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="text-sm font-medium text-ry-yellow bg-ry-yellow/10 px-3 py-1 rounded-full">
                Co-Founder Collection
              </span>
            </div>
            <h3 className="text-2xl font-bold text-ry-black mb-4">
              Where It All Started
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tucker's creative vision was the spark that started Rendered Youth. Originally conceived as "Tucker's Tees," 
              this platform has grown to celebrate the artistic talents of all young creators. Explore Tucker's original 
              designs that started this amazing journey.
            </p>
            <RYButton 
              onClick={handleViewAllClick}
              className="bg-ry-yellow hover:bg-ry-yellow/90"
            >
              View All Tucker's Designs
            </RYButton>
          </div>
          
          <div className="relative">
            {loading ? (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg mb-4">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ry-yellow mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading designs...</p>
                  </div>
                </div>
              </div>
            ) : tuckersProducts.length > 0 ? (
              <div className="space-y-4">
                {tuckersProducts.slice(0, 1).map((product) => (
                  <div key={product.id} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.design?.file_url || '/placeholder.svg'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-ry-black">{product.title}</h4>
                      <p className="text-sm text-gray-600">By {product.creatorName}</p>
                      <p className="text-lg font-bold text-ry-black mt-2">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                {tuckersProducts.length > 1 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      +{tuckersProducts.length - 1} more design{tuckersProducts.length > 2 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎨</div>
                    <p className="text-gray-500 text-sm">No designs yet</p>
                    <p className="text-xs text-gray-400 mt-1">Assign designs to see them here</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-ry-black">Tucker's Collection</h4>
                  <p className="text-sm text-gray-600">Coming Soon</p>
                </div>
              </div>
            )}
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-ry-yellow rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-ry-yellow rounded-full opacity-30"></div>
          </div>
        </div>

        {/* Featured Products Grid - Show remaining products */}
        {tuckersProducts.length > 1 && (
          <div className="mt-8 pt-8 border-t border-ry-yellow/20">
            <h4 className="text-lg font-semibold text-ry-black mb-4 text-center">More from Tucker's Collection</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tuckersProducts.slice(1).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </RYCard>
    </div>
  );
};

export default TuckersTees;
