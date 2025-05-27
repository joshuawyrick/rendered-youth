
import React, { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Upload, X } from 'lucide-react';

const CreatorUpload = () => {
  const [title, setTitle] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Please upload a JPG, PNG, or SVG file');
      return;
    }

    // Validate file size (25MB limit)
    if (selectedFile.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title for your design');
      return;
    }
    
    if (!file) {
      alert('Please upload your artwork');
      return;
    }

    // Here would be the actual upload logic
    console.log('Submitting:', { title, inspiration, file });
    
    // Redirect to submission confirmation
    window.location.href = '/creator/submitted';
  };

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
              Upload Your Artwork
            </h1>
            <p className="text-xl text-gray-600">
              Share your creativity with the world and start earning!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
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

              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-ry-yellow bg-yellow-50' 
                      : 'border-gray-300 hover:border-ry-yellow'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    Drag and drop your artwork here, or click to browse
                  </p>
                  <input
                    type="file"
                    onChange={handleFileInput}
                    accept="image/jpeg,image/png,image/svg+xml"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <RYButton type="button" variant="secondary" size="lg">
                      Choose File
                    </RYButton>
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📎</div>
                      <div>
                        <p className="font-medium text-ry-black">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </RYCard>

            {/* Submit Button */}
            <div className="text-center">
              <RYButton type="submit" variant="primary" size="lg">
                Submit for Review
              </RYButton>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorUpload;
