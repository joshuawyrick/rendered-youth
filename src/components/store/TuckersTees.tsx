
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Star, Heart } from 'lucide-react';

const TuckersTees: React.FC = () => {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-6 h-6 text-ry-yellow fill-current" />
          <h2 className="text-3xl font-bold text-ry-black">Tucker's Tees</h2>
          <Star className="w-6 h-6 text-ry-yellow fill-current" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Special collection from our co-founder Tucker - the original inspiration behind Rendered Youth
        </p>
      </div>

      <RYCard className="bg-gradient-to-br from-ry-yellow/10 to-ry-yellow/5 border-ry-yellow/20 p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="text-sm font-medium text-ry-yellow bg-ry-yellow/10 px-3 py-1 rounded-full">
                Co-Founder Collection
              </span>
            </div>
            <h3 className="text-2xl font-bold text-ry-black mb-4">
              Where It All Started
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tucker's creative vision was the spark that started Rendered Youth. Originally conceived as "Tucker's Tees," 
              this platform has grown to celebrate the artistic talents of all young creators. Explore Tucker's original 
              designs that started this amazing journey.
            </p>
            <RYButton 
              onClick={() => {
                // This will filter products to show only Tucker's designs
                // We'll need to implement the filtering logic
                console.log('Filter to Tucker\'s designs');
              }}
              className="bg-ry-yellow hover:bg-ry-yellow/90"
            >
              View Tucker's Designs
            </RYButton>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-gray-500 text-sm">Tucker's Latest Design</p>
                  <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-ry-black">Featured Design</h4>
                <p className="text-sm text-gray-600">By Tucker, Co-Founder</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-ry-yellow rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-ry-yellow rounded-full opacity-30"></div>
          </div>
        </div>
      </RYCard>
    </div>
  );
};

export default TuckersTees;
