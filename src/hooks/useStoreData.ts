
import { useState, useEffect } from 'react';
import { fetchProductsForStore } from '@/services/storeProductService';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface Product {
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

export const useStoreData = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchProductsForStore();

      console.log('Raw store data received:', data);

      // Get unique collections from products
      const uniqueCollections = data
        .filter(product => product.collections && product.collection_id)
        .map(product => ({
          id: product.collection_id,
          name: product.collections?.name || 'Unnamed Collection',
          slug: product.collections?.slug || ''
        }))
        .filter((collection, index, self) => 
          self.findIndex(c => c.id === collection.id) === index
        );
      
      console.log('Processed collections:', uniqueCollections);
      setCollections(uniqueCollections);

      // Format products for display with better state handling
      const formattedProducts: Product[] = data.map((product: any) => {
        const profile = product.designs?.profiles;
        const creatorName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Creator'
          : 'Unknown Creator';
        
        const creatorAge = profile?.age_bracket || 'Unknown';
        const creatorState = profile?.state || 'Unknown';

        return {
          id: product.id,
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName,
          creatorAge,
          creatorState,
          creatorUserId: product.designs?.user_id || '',
          imageUrl: product.designs?.file_url,
          collectionId: product.collection_id,
          design: {
            file_url: product.designs?.file_url || ''
          },
          variants: product.product_variants || []
        };
      });

      console.log('Formatted products for store:', formattedProducts);
      console.log('Sample product data:', formattedProducts[0]);
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { collections, products, loading };
};
