
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';

const HeroSection = () => {
  return (
    <section className="bg-ry-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ry-black mb-8">
            Turn Your Kid's
            <span className="block text-ry-yellow">Drawings Into</span>
            <span className="block">Wearable Art</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A magical marketplace where children's black marker masterpieces 
            become real T-shirts. Upload, create, and wear imagination.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <RYButton variant="primary" size="lg">
              Start Creating
            </RYButton>
            <RYButton variant="secondary" size="lg">
              Shop Designs
            </RYButton>
          </div>
        </div>

        {/* Hero Visual Placeholder */}
        <div className="mt-20">
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gray-100 rounded-2xl aspect-[16/9] flex items-center justify-center border-2 border-dashed border-ry-yellow">
              <div className="text-center">
                <div className="text-6xl mb-4">✏️</div>
                <p className="text-lg text-gray-600">Amazing kid art showcase coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
