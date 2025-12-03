import { useState, useEffect, useCallback } from 'react';
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProductsForStore();

      // Extract unique collections
      const uniqueCollections = data
        .filter(product => product.collections && product.collection_id)
        .reduce((acc: Collection[], product: any) => {
          const exists = acc.find(c => c.id === product.collection_id);
          if (!exists) {
            acc.push({
              id: product.collection_id,
              name: product.collections?.name || 'Unnamed Collection',
              slug: product.collections?.slug || ''
            });
          }
          return acc;
        }, []);
      
      setCollections(uniqueCollections);

      // Format products
      const formattedProducts: Product[] = data.map((product: any) => {
        const profile = product.designs?.profiles;
        const creatorName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Creator'
          : 'Unknown Creator';

        return {
          id: product.id,
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          price: Number(product.base_price || product.price),
          creatorName,
          creatorAge: profile?.age_bracket || 'Unknown',
          creatorState: profile?.state || 'Unknown',
          creatorUserId: product.designs?.user_id || '',
          imageUrl: product.designs?.file_url,
          collectionId: product.collection_id,
          design: { file_url: product.designs?.file_url || '' },
          variants: product.product_variants || []
        };
      });

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { collections, products, loading };
};
