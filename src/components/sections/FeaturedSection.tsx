
import React, { useState, useEffect } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ui/product-card';

interface FeaturedProduct {
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

const FeaturedSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Fetch recent active products with designs
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
        .eq('designs.status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);

      if (productsError) {
        console.error('Error fetching featured products:', productsError);
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
      const formattedProducts: FeaturedProduct[] = products.map((product: any) => {
        const profile = profilesData.find(p => p.id === product.designs?.user_id);
        return {
          id: product.id,
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Young Creator',
          creatorAge: profile?.age_bracket || 'Unknown',
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

      setFeaturedProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchFeaturedProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllClick = () => {
    window.location.href = '/store';
  };

  // Fallback data if no products are found
  const fallbackDesigns = [
    {
      id: 'fallback-1',
      title: "Rainbow Dragon",
      slug: "rainbow-dragon",
      price: 24.99,
      creatorName: "Emma",
      creatorAge: "8",
      creatorState: "Unknown",
      creatorUserId: "",
      imageUrl: undefined,
      design: { file_url: "" }
    },
    {
      id: 'fallback-2',
      title: "Space Adventure",
      slug: "space-adventure", 
      price: 24.99,
      creatorName: "Lucas",
      creatorAge: "10",
      creatorState: "Unknown",
      creatorUserId: "",
      imageUrl: undefined,
      design: { file_url: "" }
    },
    {
      id: 'fallback-3',
      title: "Flower Power",
      slug: "flower-power",
      price: 24.99,
      creatorName: "Sofia",
      creatorAge: "7", 
      creatorState: "Unknown",
      creatorUserId: "",
      imageUrl: undefined,
      design: { file_url: "" }
    },
    {
      id: 'fallback-4',
      title: "Superhero Cat",
      slug: "superhero-cat",
      price: 24.99,
      creatorName: "Max",
      creatorAge: "9",
      creatorState: "Unknown", 
      creatorUserId: "",
      imageUrl: undefined,
      design: { file_url: "" }
    }
  ];

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : fallbackDesigns;

  return (
    <section className="bg-ry-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-ry-black mb-6">
            Featured Designs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing artwork from our young creators
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <RYCard key={i} className="p-0 overflow-hidden">
                <div className="aspect-square bg-gray-100 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </RYCard>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {fallbackDesigns.map((design) => (
              <RYCard key={design.id} className="p-0 overflow-hidden">
                {/* Design Image Placeholder */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👕</div>
                    <p className="text-sm text-gray-500">{design.title}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-ry-black mb-1">
                    {design.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {design.creatorName}, age {design.creatorAge}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ry-black">
                      ${design.price.toFixed(2)}
                    </span>
                    <RYButton variant="primary" size="sm">
                      View
                    </RYButton>
                  </div>
                </div>
              </RYCard>
            ))}
          </div>
        )}

        <div className="text-center">
          <RYButton variant="secondary" size="lg" onClick={handleViewAllClick}>
            View All Designs
          </RYButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
