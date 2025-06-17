
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import HeroSection from '@/components/sections/HeroSection';
import ProcessSection from '@/components/sections/ProcessSection';
import FeaturedSection from '@/components/sections/FeaturedSection';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      {/* Add top padding to account for fixed navbar with proper mobile spacing */}
      <div className="pt-16">
        <main className="overflow-x-hidden">
          <HeroSection />
          <ProcessSection />
          <FeaturedSection />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
