
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';

const TopNav = () => {
  return (
    <nav className="bg-ry-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-ry-black">
              Rendered Youth
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-ry-black hover:text-ry-yellow px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="/store" className="text-ry-black hover:text-ry-yellow px-3 py-2 text-sm font-medium">
                Shop
              </a>
              <a href="/creators" className="text-ry-black hover:text-ry-yellow px-3 py-2 text-sm font-medium">
                Creators
              </a>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
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
