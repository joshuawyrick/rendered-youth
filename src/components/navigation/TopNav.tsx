
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Search } from 'lucide-react';

const TopNav = () => {
  return (
    <nav className="bg-ry-black shadow-md sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-ry-yellow">
              Rendered Youth
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <div className="relative group">
                <a href="/store" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                  Shop
                </a>
                {/* Shop by Age dropdown would go here */}
              </div>
              <a href="/creators" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                Creators
              </a>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-ry-yellow hover:text-ry-white cursor-pointer transition-colors" />
            <RYButton variant="secondary" size="sm">
              Upload Art
            </RYButton>
            <RYButton variant="primary" size="sm">
              Sign In
            </RYButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
