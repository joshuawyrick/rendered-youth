
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle } from 'lucide-react';

interface Mockup {
  id: string;
  mockup_url: string;
  mockup_order: number;
}

interface Design {
  id: string;
  title: string;
  status: string;
}

const DesignReview = () => {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');
  const [design, setDesign] = useState<Design | null>(null);
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (designId) {
      fetchDesignAndMockups();
    }
  }, [designId]);

  const fetchDesignAndMockups = async () => {
    try {
      // Fetch design details
      const { data: designData, error: designError } = await supabase
        .from('designs')
        .select('id, title, status')
        .eq('id', designId)
        .single();

      if (designError) throw designError;

      setDesign(designData);

      // Check if already selected
      const { data: selectionData } = await supabase
        .from('design_selections')
        .select('selected_mockup_id')
        .eq('design_id', designId)
        .single();

      if (selectionData) {
        setSubmitted(true);
        setSelectedMockup(selectionData.selected_mockup_id);
      }

      // Fetch mockups
      const { data: mockupsData, error: mockupsError } = await supabase
        .from('design_mockups')
        .select('id, mockup_url, mockup_order')
        .eq('design_id', designId)
        .order('mockup_order');

      if (mockupsError) throw mockupsError;

      setMockups(mockupsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Couldn't load your design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSelection = async () => {
    if (!selectedMockup || !designId) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('design_selections')
        .insert({
          design_id: designId,
          selected_mockup_id: selectedMockup,
        });

      if (error) throw error;

      // Update design status to 'selected'
      await supabase
        .from('designs')
        .update({ status: 'selected' })
        .eq('id', designId);

      setSubmitted(true);
      toast({
        title: "Perfect!",
        description: "Your design choice has been saved. It will go live soon!",
      });
    } catch (error) {
      console.error('Error submitting selection:', error);
      toast({
        title: "Error",
        description: "Couldn't save your choice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading your designs...</div>
        </div>
      </div>
    );
  }

  if (!design || mockups.length === 0) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <RYCard className="p-8 text-center">
            <h1 className="text-2xl font-bold text-ry-black mb-4">
              Designs Not Ready Yet
            </h1>
            <p className="text-gray-600">
              We're still working on your mockups. You'll get an email when they're ready!
            </p>
          </RYCard>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <RYCard className="p-12 text-center max-w-2xl">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-ry-black mb-4">
              You're All Set!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Thanks for choosing your favorite design for "{design.title}". 
              It will go live in our store soon!
            </p>
            <RYButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/creator/dashboard'}
            >
              Back to Dashboard
            </RYButton>
          </RYCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
              Pick Your Favorite!
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              We made 4 awesome designs for "{design.title}"
            </p>
            <p className="text-lg text-ry-yellow font-semibold">
              Click on your favorite one below ⬇️
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {mockups.map((mockup) => (
              <RYCard
                key={mockup.id}
                className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedMockup === mockup.id
                    ? 'ring-4 ring-ry-yellow bg-yellow-50'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedMockup(mockup.id)}
              >
                <div className="relative">
                  <img
                    src={mockup.mockup_url}
                    alt={`Design option ${mockup.mockup_order}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {selectedMockup === mockup.id && (
                    <div className="absolute top-4 right-4 bg-ry-yellow text-ry-black px-3 py-1 rounded-full font-bold">
                      ✓ PICKED!
                    </div>
                  )}
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-ry-black">
                    Option {mockup.mockup_order}
                  </h3>
                </div>
              </RYCard>
            ))}
          </div>

          {selectedMockup && (
            <div className="text-center">
              <RYButton
                variant="primary"
                size="lg"
                onClick={handleSubmitSelection}
                disabled={submitting}
                className="text-xl px-12 py-4"
              >
                {submitting ? 'Saving...' : 'This is the One! 🎉'}
              </RYButton>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DesignReview;
