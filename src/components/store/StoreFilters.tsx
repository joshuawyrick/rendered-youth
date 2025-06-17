
import React from 'react';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';
import { StateSelect } from '@/components/ui/state-select';
import { Search } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface StoreFiltersProps {
  selectedAge: string | undefined;
  setSelectedAge: (age: string | undefined) => void;
  selectedState: string | undefined;
  setSelectedState: (state: string | undefined) => void;
  selectedCollection: string | undefined;
  setSelectedCollection: (collection: string | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  collections: Collection[];
}

const StoreFilters: React.FC<StoreFiltersProps> = ({
  selectedAge,
  setSelectedAge,
  selectedState,
  setSelectedState,
  selectedCollection,
  setSelectedCollection,
  searchTerm,
  setSearchTerm,
  collections
}) => {
  return (
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
  );
};

export default StoreFilters;
