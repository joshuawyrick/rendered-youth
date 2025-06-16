
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import FileUploadZone from './FileUploadZone';

interface UploadFormProps {
  title: string;
  inspiration: string;
  file: File | null;
  dragActive: boolean;
  uploading: boolean;
  setTitle: (title: string) => void;
  setInspiration: (inspiration: string) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const UploadForm = ({
  title,
  inspiration,
  file,
  dragActive,
  uploading,
  setTitle,
  setInspiration,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onRemoveFile,
  onSubmit
}: UploadFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Title */}
      <RYCard className="p-6">
        <label className="block text-lg font-semibold text-ry-black mb-3">
          Design Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your artwork a catchy name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-lg"
          required
          disabled={uploading}
        />
      </RYCard>

      {/* Inspiration */}
      <RYCard className="p-6">
        <label className="block text-lg font-semibold text-ry-black mb-3">
          Inspiration Notes
        </label>
        <textarea
          value={inspiration}
          onChange={(e) => setInspiration(e.target.value)}
          placeholder="Tell us what inspired this design... (optional)"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent resize-none"
          disabled={uploading}
        />
      </RYCard>

      {/* File Upload */}
      <RYCard className="p-6">
        <label className="block text-lg font-semibold text-ry-black mb-3">
          Upload Your Artwork *
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Accepted formats: JPG, PNG, SVG | Maximum size: 25MB
        </p>

        <FileUploadZone
          file={file}
          dragActive={dragActive}
          uploading={uploading}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
        />
      </RYCard>

      {/* Submit Button */}
      <div className="text-center">
        <RYButton 
          type="submit" 
          variant="primary" 
          size="lg"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit for Review'}
        </RYButton>
      </div>
    </form>
  );
};

export default UploadForm;
