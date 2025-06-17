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
    <section className="bg-ry-white py-20 lg:py-32 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 top-0 w-full h-full bg-cover bg-center opacity-30 z-0"
        style={{
          backgroundImage: 'url(https://media.istockphoto.com/id/2183053906/photo/elementary-school-hispanic-students-having-fun-with-watercolor-painting-in-an-art-class-with.jpg?s=1024x1024&w=is&k=20&c=A6X9Y4KVaTIgwnVf9xvCn08kZSp5QXblcd5RkTnEJ4Y=)',
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ry-black mb-8">
            Kids Draw It
            <span className="block text-ry-yellow">We Render It</span>
            <span className="block">You Wear It</span>
          </h1>
          
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A magical marketplace where children's black marker masterpieces 
            become real T-shirts. Upload, create, and wear imagination.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <RYButton variant="primary" size="lg">
              Shop Designs
            </RYButton>
            <RYButton 
              variant="outline" 
              size="lg" 
              onClick={handleBecomeCreator}
              className="bg-ry-black text-ry-yellow hover:bg-gray-800"
            >
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
