
// Re-export all functions to maintain backward compatibility
export { fetchDesignsWithProfiles } from './designService';
export { fetchProductsWithDesigns, fetchProductsForStore } from './productDataService';
export { 
  createProductFromDesign, 
  createProductWithDetails,
  updateProductStatus, 
  updateProductDetails,
  type ProductCreateData 
} from './productMutationService';
export { 
  fetchProductVariants, 
  createProductVariants, 
  updateProductVariant, 
  deleteProductVariant,
  type ProductVariant 
} from './productVariantService';
