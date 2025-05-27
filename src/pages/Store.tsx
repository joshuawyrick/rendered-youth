
import React, { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';
import { ProductCard } from '@/components/ui/product-card';
import { StateSelect } from '@/components/ui/state-select';
import { Search } from 'lucide-react';

const Store = () => {
  const [selectedAge, setSelectedAge] = useState<string | undefined>();
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockProducts = [
    {
      id: '1',
      title: 'Rainbow Dragon',
      slug: 'rainbow-dragon',
      price: 24.99,
      creatorName: 'Emma Rodriguez',
      creatorAge: '8-10',
      creatorState: 'CA',
      imageUrl: undefined
    },
    {
      id: '2',
      title: 'Space Adventure',
      slug: 'space-adventure',
      price: 24.99,
      creatorName: 'Lucas Thompson',
      creatorAge: '11-13',
      creatorState: 'NY',
      imageUrl: undefined
    },
    {
      id: '3',
      title: 'Flower Power',
      slug: 'flower-power',
      price: 24.99,
      creatorName: 'Sofia Chen',
      creatorAge: '4-7',
      creatorState: 'TX',
      imageUrl: undefined
    },
    {
      id: '4',
      title: 'Superhero Cat',
      slug: 'superhero-cat',
      price: 24.99,
      creatorName: 'Max Johnson',
      creatorAge: '14-17',
      creatorState: 'FL',
      imageUrl: undefined
    }
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesAge = !selectedAge || product.creatorAge === selectedAge;
    const matchesState = !selectedState || product.creatorState === selectedState;
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAge && matchesState && matchesSearch;
  });

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
          {filteredProducts.length === 0 && (
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
