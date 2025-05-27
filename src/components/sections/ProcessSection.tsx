
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';

const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      icon: "✏️",
      title: "Draw & Upload",
      description: "Kids grab their favorite black marker and create amazing artwork, then upload it to our platform."
    },
    {
      number: 2,
      icon: "🎨",
      title: "We Perfect It",
      description: "Our team creates beautiful mockups and prepares your child's design for printing."
    },
    {
      number: 3,
      icon: "👕",
      title: "Shop & Wear",
      description: "Browse incredible designs from young artists and order high-quality T-shirts."
    },
    {
      number: 4,
      icon: "💵",
      title: "Kids Get Paid",
      description: "Young creators earn money from each sale, encouraging their artistic journey."
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-ry-black mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From sketch to shirt in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <RYCard key={step.number} className="text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-ry-yellow text-ry-black w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
              </div>
              
              <div className="text-4xl mb-4 mt-2">{step.icon}</div>
              <h3 className="text-xl font-semibold text-ry-black mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </RYCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
