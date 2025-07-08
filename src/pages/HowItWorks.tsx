
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      image: "/lovable-uploads/2c73c1b4-2414-4246-9bab-1674daf4bf59.png",
      title: "Draw & Upload",
      description: "Kids grab their favorite black sharpie and a plain white piece of paper, create amazing artwork, then upload it to our platform.",
      details: "Children can upload JPG, PNG, or SVG files up to 25MB. We accept all types of drawings made with black sharpies or digital equivalents."
    },
    {
      number: 2,
      image: "/lovable-uploads/a62f0304-e913-4aba-8f6c-816c0db736c6.png",
      title: "We Perfect It",
      description: "Our team creates beautiful mockups and prepares your child's design for printing.",
      details: "Our artists create 4 different mockup options showing how the design would look on a t-shirt. The young creator then chooses their favorite."
    },
    {
      number: 3,
      image: "/lovable-uploads/32425366-0bed-4dd2-9953-374508b3e36a.png",
      title: "Live on Our Site",
      description: "We put your rendered design live on our website for people to purchase as high-quality T-shirts.",
      details: "Published designs become available in our store with sizes from S to XXL. We use premium quality materials and printing techniques."
    },
    {
      number: 4,
      image: "/lovable-uploads/29bec9e1-d973-40d6-a867-cbaa6be55d00.png",
      title: "Kids Share in Profits",
      description: "Young creators share in the profits from each sale, encouraging their artistic journey.",
      details: "Creators share in the profits after we handle design, printing, and shipping. Payments are processed weekly through Stripe Connect, helping kids learn about entrepreneurship."
    }
  ];

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-ry-black mb-8">
              How It Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              From sketch to shirt in four simple steps. Join thousands of young artists 
              who are turning their creativity into wearable art and sharing in the profits.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {steps.map((step) => (
                <RYCard key={step.number} className="relative p-8">
                  <div className="absolute -top-4 left-8">
                    <div className="bg-ry-yellow text-ry-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="mb-6 mt-4 flex justify-center">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-56 h-56 object-contain rounded-lg shadow-md bg-white p-2"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-ry-black mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.details}
                  </p>
                </RYCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black mb-8">
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of young artists and start sharing in the profits from your creativity today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/sign-up" className="bg-ry-yellow text-ry-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                Become a Creator
              </a>
              <a href="/store" className="border-2 border-ry-yellow text-ry-yellow px-8 py-3 rounded-lg font-medium hover:bg-ry-yellow hover:text-ry-black transition-colors">
                Shop Designs
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
