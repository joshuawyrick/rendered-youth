
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

export const filterProducts = (
  products: Product[],
  filters: {
    selectedAge?: string;
    selectedState?: string;
    selectedCollection?: string;
    searchTerm: string;
  }
) => {
  const { selectedAge, selectedState, selectedCollection, searchTerm } = filters;
  
  return products.filter(product => {
    const matchesAge = !selectedAge || product.creatorAge === selectedAge;
    const matchesState = !selectedState || product.creatorState === selectedState;
    const matchesCollection = !selectedCollection || product.collectionId === selectedCollection;
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAge && matchesState && matchesCollection && matchesSearch;
  });
};
