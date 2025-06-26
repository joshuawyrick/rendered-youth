
import React, { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import StoreHeader from '@/components/store/StoreHeader';
import TuckersTees from '@/components/store/TuckersTees';
import StoreFilters from '@/components/store/StoreFilters';
import ProductGrid from '@/components/store/ProductGrid';
import { useStoreData } from '@/hooks/useStoreData';
import { filterProducts } from '@/utils/storeFilters';

const Store = () => {
  const [selectedAge, setSelectedAge] = useState<string | undefined>();
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { collections, products, loading } = useStoreData();

  const filteredProducts = filterProducts(products, {
    selectedAge,
    selectedState,
    selectedCollection,
    searchTerm
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
          <StoreHeader />
          
          {/* Tucker's Tees Special Section */}
          <TuckersTees />
          
          {/* Main Content with Sidebar Layout */}
          <div className="flex flex-col lg:flex-row gap-8 mt-12">
            {/* Left Sidebar - Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <StoreFilters
                  selectedAge={selectedAge}
                  setSelectedAge={setSelectedAge}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  collections={collections}
                />
              </div>
            </aside>

            {/* Main Content - Products */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm">
                  Showing {filteredProducts.length} design{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              <ProductGrid products={filteredProducts} loading={false} />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Store;
