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
    <section className="bg-ry-white py-12 sm:py-16 lg:py-20 xl:py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-ry-black mb-6 sm:mb-8 leading-tight">
            Kids Draw It
            <span className="block text-ry-yellow mt-2">We Render It</span>
            <span className="block mt-2">You Wear It</span>
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto px-4 leading-relaxed">
            A magical marketplace where children's black marker masterpieces 
            become real T-shirts. Upload, create, and wear imagination.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-14 lg:mb-16 px-4">
            <RYButton 
              variant="primary" 
              size="lg"
              className="w-full sm:w-auto min-w-[160px]"
            >
              Shop Designs
            </RYButton>
            <RYButton 
              variant="outline" 
              size="lg" 
              onClick={handleBecomeCreator}
              className="bg-ry-black text-ry-yellow hover:bg-gray-800 w-full sm:w-auto min-w-[160px]"
            >
              Become a Creator
            </RYButton>
          </div>

          {/* Browse by Age Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-ry-black mb-4 sm:mb-6">
              Browse by Age
            </h2>
            <AgeFilterChips
              selectedAge={selectedAge}
              onAgeChange={handleAgeChange}
              className="justify-center flex-wrap gap-2 sm:gap-3"
            />
          </div>
        </div>

        {/* Hero Visual Placeholder */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="relative mx-auto max-w-4xl px-4">
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9] flex items-center justify-center border-2 border-dashed border-ry-yellow">
              <div className="text-center p-4">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">👕</div>
                <p className="text-base sm:text-lg text-gray-600 px-2">Amazing kid art showcase coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
