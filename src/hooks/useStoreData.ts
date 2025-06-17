
import { useState, useEffect } from 'react';
import { fetchProductsForStore } from '@/services/productService';

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

      // Get unique collections from products
      const uniqueCollections = data
        .filter(product => product.collections)
        .map(product => product.collections)
        .filter((collection, index, self) => 
          collection && self.findIndex(c => c && c.name === collection.name) === index
        )
        .map(collection => ({
          id: collection?.name || '',
          name: collection?.name || '',
          slug: collection?.slug || ''
        }));
      
      setCollections(uniqueCollections);

      // Format products for display
      const formattedProducts: Product[] = data.map((product: any) => ({
        id: product.id,
        title: product.title,
        slug: product.title.toLowerCase().replace(/\s+/g, '-'),
        price: Number(product.base_price || product.price),
        creatorName: `${product.designs?.profiles?.first_name || ''} ${product.designs?.profiles?.last_name || ''}`.trim(),
        creatorAge: product.designs?.profiles?.age_bracket || 'Unknown',
        creatorState: 'Unknown', // We'll need to add state to profiles table later
        imageUrl: product.designs?.file_url,
        collectionId: product.collection_id,
        design: {
          file_url: product.designs?.file_url || ''
        },
        variants: product.product_variants || []
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { collections, products, loading };
};
