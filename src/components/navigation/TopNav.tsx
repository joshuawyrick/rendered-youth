
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Search } from 'lucide-react';

const TopNav = () => {
  return (
    <nav className="fixed top-0 w-full bg-ry-black shadow-md z-50 h-16">
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
                {/* Shop by Age dropdown */}
                <div className="absolute left-0 mt-1 w-48 bg-ry-white border border-ry-black rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <a href="/store?age=4-7" className="block px-4 py-2 text-sm text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 4-7</a>
                    <a href="/store?age=8-10" className="block px-4 py-2 text-sm text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 8-10</a>
                    <a href="/store?age=11-13" className="block px-4 py-2 text-sm text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 11-13</a>
                    <a href="/store?age=14-17" className="block px-4 py-2 text-sm text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 14-17</a>
                  </div>
                </div>
              </div>
              <a href="/creators" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                Creators
              </a>
              <a href="/how-it-works" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                How It Works
              </a>
              <a href="/about" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                About
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
