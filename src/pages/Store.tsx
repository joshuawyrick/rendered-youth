
import React, { useState, useEffect } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';
import { ProductCard } from '@/components/ui/product-card';
import { StateSelect } from '@/components/ui/state-select';
import { Search } from 'lucide-react';
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
  profiles?: {
    first_name: string;
    last_name: string;
    age_bracket: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

const Store = () => {
  const [selectedAge, setSelectedAge] = useState<string | undefined>();
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
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
          collection && self.findIndex(c => c?.id === collection?.id) === index
        );
      
      setCollections(uniqueCollections as Collection[]);

      // Format products for display
      const formattedProducts: Product[] = data.map((product: any) => ({
        id: product.id,
        title: product.title,
        slug: product.title.toLowerCase().replace(/\s+/g, '-'),
        price: Number(product.base_price || product.price),
        creatorName: `${product.designs.profiles.first_name || ''} ${product.designs.profiles.last_name || ''}`.trim(),
        creatorAge: product.designs.profiles.age_bracket || 'Unknown',
        creatorState: 'Unknown', // We'll need to add state to profiles table later
        imageUrl: product.designs.file_url,
        collectionId: product.collection_id,
        design: {
          file_url: product.designs.file_url
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

  const filteredProducts = products.filter(product => {
    const matchesAge = !selectedAge || product.creatorAge === selectedAge;
    const matchesState = !selectedState || product.creatorState === selectedState;
    const matchesCollection = !selectedCollection || product.collectionId === selectedCollection;
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAge && matchesState && matchesCollection && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ry-yellow mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
              Shop Designs
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing artwork from talented young creators
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
              {/* Collection Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-ry-black mb-3">Filter by Collection</h3>
                <select
                  value={selectedCollection || ''}
                  onChange={(e) => setSelectedCollection(e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                >
                  <option value="">All Collections</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-ry-black mb-3">Filter by Creator Age</h3>
                <AgeFilterChips
                  selectedAge={selectedAge}
                  onAgeChange={setSelectedAge}
                />
              </div>

              {/* State Filter */}
              <div className="flex-1 max-w-xs">
                <h3 className="text-sm font-medium text-ry-black mb-3">Filter by State</h3>
                <StateSelect
                  selected={selectedState}
                  onChange={setSelectedState}
                />
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md">
                <h3 className="text-sm font-medium text-ry-black mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search designs or creators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredProducts.length} design{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-ry-black mb-2">No designs found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Store;
