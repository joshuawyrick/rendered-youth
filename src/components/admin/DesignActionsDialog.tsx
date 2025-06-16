
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RYButton } from '@/components/ui/ry-button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import MockupUploader from './MockupUploader';
import { Eye, Upload, X } from 'lucide-react';

interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface DesignActionsDialogProps {
  design: Design | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const DesignActionsDialog = ({ 
  design, 
  open, 
  onOpenChange, 
  onComplete 
}: DesignActionsDialogProps) => {
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  if (!design) return null;

  const handleReject = async () => {
    try {
      await supabase
        .from('designs')
        .update({ status: 'rejected' })
        .eq('id', design.id);

      toast({
        title: "Design Rejected",
        description: "The design has been rejected",
        variant: "destructive",
      });

      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error rejecting design:', error);
      toast({
        title: "Error",
        description: "Failed to reject design",
        variant: "destructive",
      });
    }
  };

  const handleMockupComplete = () => {
    setShowUploader(false);
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review Design: {design.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Design Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Original Design</h3>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={design.file_url}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Design Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Title:</span>
                  <p className="text-gray-600">{design.title}</p>
                </div>
                <div>
                  <span className="font-medium">Submitted:</span>
                  <p className="text-gray-600">
                    {new Date(design.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-gray-600 capitalize">
                    {design.status.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <RYButton
                  variant="secondary"
                  onClick={() => window.open(design.file_url, '_blank')}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Size
                </RYButton>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!showUploader ? (
            <div className="flex gap-3">
              <RYButton
                onClick={() => setShowUploader(true)}
                variant="primary"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Create Mockups
              </RYButton>
              <RYButton
                onClick={handleReject}
                variant="secondary"
                className="px-6"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </RYButton>
            </div>
          ) : (
            <MockupUploader
              designId={design.id}
              onComplete={handleMockupComplete}
              onCancel={() => setShowUploader(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignActionsDialog;
