
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';

const FeaturedSection = () => {
  const featuredDesigns = [
    {
      id: 1,
      title: "Rainbow Dragon",
      artist: "Emma, age 8",
      price: "$24.99"
    },
    {
      id: 2,
      title: "Space Adventure",
      artist: "Lucas, age 10",
      price: "$24.99"
    },
    {
      id: 3,
      title: "Flower Power",
      artist: "Sofia, age 7",
      price: "$24.99"
    },
    {
      id: 4,
      title: "Superhero Cat",
      artist: "Max, age 9",
      price: "$24.99"
    }
  ];

  return (
    <section className="bg-ry-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-ry-black mb-6">
            Featured Designs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing artwork from our young creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredDesigns.map((design) => (
            <RYCard key={design.id} className="p-0 overflow-hidden">
              {/* Design Image Placeholder */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center border-b border-gray-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">👕</div>
                  <p className="text-sm text-gray-500">{design.title}</p>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-ry-black mb-1">
                  {design.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  by {design.artist}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ry-black">
                    {design.price}
                  </span>
                  <RYButton variant="primary" size="sm">
                    View
                  </RYButton>
                </div>
              </div>
            </RYCard>
          ))}
        </div>

        <div className="text-center">
          <RYButton variant="secondary" size="lg">
            View All Designs
          </RYButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
