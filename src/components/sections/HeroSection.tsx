
import React, { useState } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';

const HeroSection = () => {
  const [selectedAge, setSelectedAge] = useState<string | undefined>();

  const handleAgeChange = (age: string | undefined) => {
    setSelectedAge(age);
    if (age) {
      // Navigate to creators page with age filter
      window.location.href = `/creators?age=${age}`;
    }
  };

  const handleBecomeCreator = () => {
    window.location.href = '/age-verification';
  };

  return (
    <section className="bg-ry-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ry-black mb-8">
            Kid Art,
            <span className="block text-ry-yellow">Grown-Up</span>
            <span className="block">Tees</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A magical marketplace where children's black marker masterpieces 
            become real T-shirts. Upload, create, and wear imagination.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <RYButton variant="primary" size="lg">
              Shop Designs
            </RYButton>
            <RYButton variant="secondary" size="lg" onClick={handleBecomeCreator}>
              Become a Creator
            </RYButton>
          </div>

          {/* Browse by Age Section */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-semibold text-ry-black mb-6">
              Browse by Age
            </h2>
            <AgeFilterChips
              selectedAge={selectedAge}
              onAgeChange={handleAgeChange}
              className="justify-center"
            />
          </div>
        </div>

        {/* Hero Visual Placeholder */}
        <div className="mt-20">
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gray-100 rounded-2xl aspect-[16/9] flex items-center justify-center border-2 border-dashed border-ry-yellow">
              <div className="text-center">
                <div className="text-6xl mb-4">👕</div>
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
