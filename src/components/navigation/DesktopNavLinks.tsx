
import React from 'react';
import { User, Settings } from 'lucide-react';

interface DesktopNavLinksProps {
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  isAdmin: boolean;
}

const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  user,
  profileLoading,
  isCreator,
  isAdmin
}) => {
  return (
    <div className="hidden lg:block">
      <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
        <a href="/" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
          Home
        </a>
        <div className="relative group">
          <a href="/store" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
            Shop
          </a>
          {/* Shop by Age dropdown */}
          <div className="absolute left-0 mt-1 w-48 bg-ry-white border border-ry-black rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
        <a href="/training-program" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
          Future Founders
        </a>
        <a href="/how-it-works" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
          How It Works
        </a>
        <a href="/about" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
          About
        </a>
        
        {/* Dashboard Links for authenticated users */}
        {user && !profileLoading && (
          <>
            {isCreator && (
              <a href="/creator/dashboard" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <User className="h-4 w-4 mr-1" />
                Creator Dashboard
              </a>
            )}
            {isAdmin && (
              <a href="/admin" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Admin Dashboard
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNavLinks;
