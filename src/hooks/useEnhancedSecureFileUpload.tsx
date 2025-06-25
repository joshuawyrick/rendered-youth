
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { performAdvancedFileValidation, logEnhancedSecurityEvent } from '@/services/enhancedSecurityService';
import { rateLimitService } from '@/services/rateLimitService';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedSecureFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useSecureAuth();

  const uploadFile = async (file: File, folder: string = 'designs'): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files",
        variant: "destructive",
      });
      return null;
    }

    // Check rate limits
    const rateLimitCheck = await rateLimitService.checkRateLimit('fileUpload', user.id);
    if (!rateLimitCheck.allowed) {
      toast({
        title: "Upload limit reached",
        description: `Please wait ${rateLimitCheck.retryAfter} seconds before uploading again`,
        variant: "destructive",
      });
      return null;
    }

    // Record upload attempt
    await rateLimitService.recordAttempt('fileUpload', user.id);

    // Enhanced file validation
    const validation = await performAdvancedFileValidation(file);
    if (!validation.isValid) {
      toast({
        title: "File validation failed",
        description: validation.errors.join(', '),
        variant: "destructive",
      });

      await logEnhancedSecurityEvent({
        action: 'FILE_UPLOAD_REJECTED',
        resource_type: 'file',
        severity: 'medium',
        metadata: { 
          reasons: validation.errors, 
          filename: file.name, 
          type: file.type,
          size: file.size
        }
      });
      return null;
    }

    setUploading(true);
    
    try {
      // Create secure filename with user ID prefix and timestamp
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const secureFileName = `${user.id}/${timestamp}-${randomSuffix}.${fileExt}`;
      const filePath = `${folder}/${secureFileName}`;

      // Upload to Supabase storage with user context
      const { data, error } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath);

      // Log successful upload
      await logEnhancedSecurityEvent({
        action: 'FILE_UPLOAD_SUCCESS',
        resource_type: 'file',
        resource_id: data.path,
        severity: 'low',
        metadata: { 
          filename: file.name, 
          size: file.size, 
          folder,
          secureFilename: secureFileName
        }
      });

      // Record successful upload for rate limiting
      await rateLimitService.recordSuccess('fileUpload', user.id);

      return publicUrl;
    } catch (error) {
      console.error('Enhanced file upload error:', error);
      
      await logEnhancedSecurityEvent({
        action: 'FILE_UPLOAD_ERROR',
        resource_type: 'file',
        severity: 'high',
        metadata: { 
          filename: file.name, 
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: user.id
        }
      });

      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadFile
  };
};
