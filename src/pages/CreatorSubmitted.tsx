
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { CheckCircle, Upload, ArrowLeft } from 'lucide-react';

const CreatorSubmitted = () => {
  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <RYCard className="p-12 max-w-2xl mx-auto">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>

              {/* Header */}
              <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
                Submission Received!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                We got your artwork! Our team will review it and send you 4 amazing mock-ups soon.
              </p>

              {/* Next Steps */}
              <div className="text-left mb-8">
                <h2 className="text-lg font-semibold text-ry-black mb-4">What happens next?</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <p className="text-gray-600">Our design team reviews your artwork (1-2 days)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <p className="text-gray-600">We create 4 professional mock-ups on different t-shirt styles</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <p className="text-gray-600">You choose your favorite mock-up</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                    <p className="text-gray-600">Your design goes live in our store!</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <RYButton 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.location.href = '/creator/dashboard'}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </RYButton>
                <RYButton 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.location.href = '/creator/upload'}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Another
                </RYButton>
              </div>
            </RYCard>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorSubmitted;
