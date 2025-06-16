
import React, { useState, useEffect } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import UploadForm from '@/components/upload/UploadForm';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const CreatorUpload = () => {
  const [title, setTitle] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const {
    file,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile
  } = useFileUpload();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
    }
  }, [user, loading]);

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `designs/${fileName}`;

    const { data, error } = await supabase.storage
      .from('design-uploads')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('design-uploads')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your design",
        variant: "destructive",
      });
      return;
    }
    
    if (!file) {
      toast({
        title: "Missing artwork",
        description: "Please upload your artwork",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in to upload your artwork",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileUrl = await uploadFileToStorage(file);

      // Save design to database
      const { data, error } = await supabase
        .from('designs')
        .insert({
          user_id: user.id,
          title: title.trim(),
          inspiration: inspiration.trim() || null,
          file_url: fileUrl,
          file_name: file.name,
          file_size: file.size,
          status: 'pending_review'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Upload successful!",
        description: "Your artwork has been submitted for review",
      });

      // Redirect to submission confirmation
      window.location.href = '/creator/submitted';
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

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

          <UploadForm
            title={title}
            inspiration={inspiration}
            file={file}
            dragActive={dragActive}
            uploading={uploading}
            setTitle={setTitle}
            setInspiration={setInspiration}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onFileSelect={handleFileInput}
            onRemoveFile={removeFile}
            onSubmit={handleSubmit}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorUpload;
