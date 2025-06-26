
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
        <div className="pt-16 flex">
          {/* Fixed Left Sidebar - Filters */}
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 ml-80">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ry-yellow mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16 flex">
        {/* Fixed Left Sidebar - Filters */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
          <div className="p-6">
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
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <StoreHeader />
            
            {/* Tucker's Tees Special Section */}
            <TuckersTees />
            
            <div className="mt-12">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm">
                  Showing {filteredProducts.length} design{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              <ProductGrid products={filteredProducts} loading={false} />
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Store;
