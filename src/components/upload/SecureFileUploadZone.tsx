
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEnhancedSecureFileUpload } from '@/hooks/useEnhancedSecureFileUpload';
import { Upload, Shield, FileCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SecureFileUploadZoneProps {
  onUploadComplete: (url: string, fileName: string, fileSize: number) => void;
  onUploadError: (error: string) => void;
  bucket: string;
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
  enableVirusScanning?: boolean;
  disabled?: boolean;
}

export const SecureFileUploadZone: React.FC<SecureFileUploadZoneProps> = ({
  onUploadComplete,
  onUploadError,
  bucket,
  folder,
  maxSize = 25 * 1024 * 1024, // 25MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  enableVirusScanning = true,
  disabled = false
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'scanning' | 'success' | 'error'>('idle');
  const { uploadFile, isUploading, uploadProgress } = useEnhancedSecureFileUpload();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadStatus('uploading');

    try {
      if (enableVirusScanning && uploadProgress > 40 && uploadProgress < 80) {
        setUploadStatus('scanning');
      }

      const result = await uploadFile(file, {
        bucket,
        folder,
        maxSize,
        allowedTypes,
        enableVirusScanning
      });

      if (result.error) {
        setUploadStatus('error');
        onUploadError(result.error);
        toast.error(result.error);
      } else if (result.url && result.fileName && result.fileSize) {
        setUploadStatus('success');
        onUploadComplete(result.url, result.fileName, result.fileSize);
        toast.success('File uploaded successfully!');
        
        // Reset status after success
        setTimeout(() => setUploadStatus('idle'), 2000);
      }
    } catch (error) {
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError(errorMessage);
      toast.error(errorMessage);
    }
  }, [uploadFile, bucket, folder, maxSize, allowedTypes, enableVirusScanning, disabled, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': allowedTypes.map(type => `.${type.split('/')[1]}`)
    },
    maxSize,
    multiple: false,
    disabled: disabled || isUploading
  });

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Upload className="h-8 w-8 text-blue-500 animate-pulse" />;
      case 'scanning':
        return <Shield className="h-8 w-8 text-orange-500 animate-pulse" />;
      case 'success':
        return <FileCheck className="h-8 w-8 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <Upload className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading file...';
      case 'scanning':
        return 'Scanning for security threats...';
      case 'success':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return isDragActive ? 'Drop the file here...' : 'Drag & drop a file here, or click to select';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            
            <div className="space-y-2">
              <p className="text-lg font-medium">{getStatusText()}</p>
              <p className="text-sm text-gray-500">
                Supported formats: {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Max file size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>

            {isUploading && (
              <div className="w-full max-w-xs space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
              </div>
            )}

            {enableVirusScanning && uploadStatus === 'idle' && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>Security scanning enabled</span>
              </div>
            )}

            {!isUploading && uploadStatus === 'idle' && (
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
