
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { deleteEntireProduct } from '@/services/productDeletionService';
import ProductDeleteDialog from './ProductDeleteDialog';
import type { Design } from './types';

interface DesignCardProps {
  design: Design;
  creating: string | null;
  onCreateProduct: (design: Design) => void;
  onProductDeleted?: () => void;
  hasExistingProduct?: boolean;
  existingProductId?: string;
  existingProductTitle?: string;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  creating,
  onCreateProduct,
  onProductDeleted,
  hasExistingProduct = false,
  existingProductId,
  existingProductTitle
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteProduct = async () => {
    if (!existingProductId) return;
    
    setDeleting(true);
    try {
      await deleteEntireProduct(existingProductId);
      toast({
        title: "Product Deleted",
        description: "Product and all associated data have been permanently deleted.",
      });
      onProductDeleted?.();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <RYCard className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          <img
            src={design.file_url}
            alt={design.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-ry-black">{design.title}</h4>
          <p className="text-sm text-gray-600">
            by {design.profiles?.first_name} {design.profiles?.last_name}
          </p>
          
          {hasExistingProduct ? (
            <div className="space-y-2">
              <p className="text-xs text-green-600 font-medium">Product exists</p>
              <RYButton
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Product
              </RYButton>
            </div>
          ) : (
            <RYButton
              variant="primary"
              size="sm"
              onClick={() => onCreateProduct(design)}
              disabled={creating === design.id}
              className="w-full"
            >
              {creating === design.id ? (
                'Creating...'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Product ($25.00)
                </>
              )}
            </RYButton>
          )}
        </div>
      </RYCard>

      {hasExistingProduct && existingProductTitle && (
        <ProductDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          productTitle={existingProductTitle}
          onConfirm={handleDeleteProduct}
          loading={deleting}
        />
      )}
    </>
  );
};

export default DesignCard;
