
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
      <main>
        <HeroSection />
        <ProcessSection />
        <FeaturedSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
