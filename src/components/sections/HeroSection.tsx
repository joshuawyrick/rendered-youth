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

          {/* How It Works Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-ry-black mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From sketch to shirt in four simple steps. Join thousands of young artists 
                who are turning their creativity into wearable art.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-ry-yellow text-ry-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
                  1
                </div>
                <div className="mb-6">
                  <img 
                    src="/lovable-uploads/436f6fdb-bb40-4a63-a912-d0affa7aba5f.png"
                    alt="Draw & Upload"
                    className="w-32 h-32 object-contain mx-auto rounded-lg shadow-md bg-white p-2"
                  />
                </div>
                <h3 className="text-xl font-bold text-ry-black mb-4">Draw & Upload</h3>
                <p className="text-gray-600">
                  Kids grab their favorite black sharpie and create amazing artwork, then upload it to our platform.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-ry-yellow text-ry-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
                  2
                </div>
                <div className="mb-6">
                  <img 
                    src="/lovable-uploads/a62f0304-e913-4aba-8f6c-816c0db736c6.png"
                    alt="We Perfect It"
                    className="w-32 h-32 object-contain mx-auto rounded-lg shadow-md bg-white p-2"
                  />
                </div>
                <h3 className="text-xl font-bold text-ry-black mb-4">We Perfect It</h3>
                <p className="text-gray-600">
                  Our team creates beautiful mockups and prepares your child's design for printing.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-ry-yellow text-ry-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
                  3
                </div>
                <div className="mb-6">
                  <img 
                    src="/lovable-uploads/32425366-0bed-4dd2-9953-374508b3e36a.png"
                    alt="Live on Our Site"
                    className="w-32 h-32 object-contain mx-auto rounded-lg shadow-md bg-white p-2"
                  />
                </div>
                <h3 className="text-xl font-bold text-ry-black mb-4">Live on Our Site</h3>
                <p className="text-gray-600">
                  We put your rendered design live on our website for people to purchase as T-shirts.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-ry-yellow text-ry-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto">
                  4
                </div>
                <div className="mb-6">
                  <img 
                    src="/lovable-uploads/98f40132-69fb-40d6-84ba-f3614fe24125.png"
                    alt="Kids Share in Profits"
                    className="w-32 h-32 object-contain mx-auto rounded-lg shadow-md bg-white p-2"
                  />
                </div>
                <h3 className="text-xl font-bold text-ry-black mb-4">Kids Share in Profits</h3>
                <p className="text-gray-600">
                  Young creators share in the profits from each sale, encouraging their artistic journey.
                </p>
              </div>
            </div>
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
