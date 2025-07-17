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

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-7 lg:mb-8 px-4">
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
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
