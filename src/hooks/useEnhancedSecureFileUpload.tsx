
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthSecurity } from './useAuthSecurity';

interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
  enableVirusScanning?: boolean;
}

interface UploadResult {
  url: string | null;
  error: string | null;
  fileName: string | null;
  fileSize: number | null;
}

export const useEnhancedSecureFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { logSecurityEvent, checkRateLimit } = useAuthSecurity();

  // File magic number validation
  const validateFileType = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arr = new Uint8Array(reader.result as ArrayBuffer);
        let header = '';
        for (let i = 0; i < Math.min(arr.length, 4); i++) {
          header += arr[i].toString(16).padStart(2, '0');
        }
        
        // Check magic numbers for common image formats
        const imageSignatures = {
          'ffd8ff': 'image/jpeg',
          '89504e47': 'image/png',
          '47494638': 'image/gif',
          '52494646': 'image/webp' // Actually checks for RIFF which is used by WebP
        };
        
        const isValidImage = Object.keys(imageSignatures).some(signature => 
          header.toLowerCase().startsWith(signature.toLowerCase())
        );
        
        resolve(isValidImage);
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  // Enhanced file validation
  const validateFile = async (file: File, options: UploadOptions): Promise<string | null> => {
    // Check file size
    const maxSize = options.maxSize || 25 * 1024 * 1024; // 25MB default
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / 1024 / 1024}MB`;
    }

    // Check file type by extension
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'File type not allowed';
    }

    // Validate file magic numbers
    const isValidType = await validateFileType(file);
    if (!isValidType) {
      return 'File content does not match file extension';
    }

    // Check filename for suspicious patterns
    const suspiciousPatterns = ['.php', '.js', '.html', '.exe', '.bat', '<script', 'javascript:'];
    const fileName = file.name.toLowerCase();
    for (const pattern of suspiciousPatterns) {
      if (fileName.includes(pattern)) {
        return 'Filename contains suspicious content';
      }
    }

    return null;
  };

  // Simulate virus scanning
  const simulateVirusScanning = async (file: File): Promise<boolean> => {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for suspicious file patterns that might indicate malware
    const suspiciousNames = ['virus', 'malware', 'trojan', 'exploit'];
    const fileName = file.name.toLowerCase();
    
    return !suspiciousNames.some(name => fileName.includes(name));
  };

  const uploadFile = async (file: File, options: UploadOptions): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Rate limiting check
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const canProceed = await checkRateLimit('file_upload', user.id);
        if (!canProceed) {
          throw new Error('Upload rate limit exceeded. Please try again later.');
        }
      }

      // Log upload attempt
      await logSecurityEvent('file_upload_attempt', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        timestamp: new Date().toISOString()
      });

      setUploadProgress(20);

      // Validate file
      const validationError = await validateFile(file, options);
      if (validationError) {
        await logSecurityEvent('file_upload_validation_failed', {
          fileName: file.name,
          error: validationError,
          timestamp: new Date().toISOString()
        });
        throw new Error(validationError);
      }

      setUploadProgress(40);

      // Virus scanning if enabled
      if (options.enableVirusScanning) {
        const isSafe = await simulateVirusScanning(file);
        if (!isSafe) {
          await logSecurityEvent('file_upload_virus_detected', {
            fileName: file.name,
            timestamp: new Date().toISOString()
          });
          throw new Error('File failed security scan');
        }
      }

      setUploadProgress(60);

      // Generate secure filename
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const safeFileName = `${timestamp}_${randomSuffix}.${fileExt}`;
      
      // Create file path
      const filePath = options.folder 
        ? `${options.folder}/${user?.id}/${safeFileName}`
        : `${user?.id}/${safeFileName}`;

      setUploadProgress(80);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        await logSecurityEvent('file_upload_storage_failed', {
          fileName: file.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        throw error;
      }

      setUploadProgress(90);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      setUploadProgress(100);

      // Log successful upload
      await logSecurityEvent('file_upload_success', {
        fileName: file.name,
        filePath: filePath,
        fileSize: file.size,
        timestamp: new Date().toISOString()
      });

      return {
        url: urlData.publicUrl,
        error: null,
        fileName: safeFileName,
        fileSize: file.size
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      await logSecurityEvent('file_upload_failed', {
        fileName: file.name,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      return {
        url: null,
        error: errorMessage,
        fileName: null,
        fileSize: null
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadProgress
  };
};
