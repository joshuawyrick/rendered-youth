
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { User, Settings } from 'lucide-react';

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  closeMobileMenu: () => void;
  signOut: () => void;
  handleBecomeCreatorClick: () => void;
  handleSignInClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMobileMenuOpen,
  user,
  profileLoading,
  isCreator,
  isAdmin,
  closeMobileMenu,
  signOut,
  handleBecomeCreatorClick,
  handleSignInClick
}) => {
  if (!isMobileMenuOpen) return null;

  return (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-ry-black border-t border-ry-yellow shadow-lg z-40">
      <div className="px-4 py-2 space-y-1">
        <a 
          href="/" 
          className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-base font-medium transition-colors border-b border-gray-700"
          onClick={closeMobileMenu}
        >
          Home
        </a>
        <a 
          href="/store" 
          className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-base font-medium transition-colors border-b border-gray-700"
          onClick={closeMobileMenu}
        >
          Shop
        </a>
        
        {/* Mobile Shop by Age submenu */}
        <div className="pl-6 space-y-1">
          <a 
            href="/store?age=4-7" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-sm transition-colors"
            onClick={closeMobileMenu}
          >
            Ages 4-7
          </a>
          <a 
            href="/store?age=8-10" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-sm transition-colors"
            onClick={closeMobileMenu}
          >
            Ages 8-10
          </a>
          <a 
            href="/store?age=11-13" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-sm transition-colors"
            onClick={closeMobileMenu}
          >
            Ages 11-13
          </a>
          <a 
            href="/store?age=14-17" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-sm transition-colors border-b border-gray-700"
            onClick={closeMobileMenu}
          >
            Ages 14-17
          </a>
        </div>

        <a 
          href="/creators" 
          className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-base font-medium transition-colors border-b border-gray-700"
          onClick={closeMobileMenu}
        >
          Creators
        </a>
        <a 
          href="/how-it-works" 
          className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-base font-medium transition-colors border-b border-gray-700"
          onClick={closeMobileMenu}
        >
          How It Works
        </a>
        <a 
          href="/about" 
          className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-base font-medium transition-colors border-b border-gray-700"
          onClick={closeMobileMenu}
        >
          About
        </a>
        
        {/* Mobile Dashboard Links for authenticated users */}
        {user && !profileLoading && (
          <>
            {isCreator && (
              <a 
                href="/creator/dashboard" 
                className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-base font-medium transition-colors border-b border-gray-700"
                onClick={closeMobileMenu}
              >
                <User className="h-4 w-4 mr-2 inline" />
                Creator Dashboard
              </a>
            )}
            {isAdmin && (
              <a 
                href="/admin" 
                className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-base font-medium transition-colors border-b border-gray-700"
                onClick={closeMobileMenu}
              >
                <Settings className="h-4 w-4 mr-2 inline" />
                Admin Dashboard
              </a>
            )}
          </>
        )}

        {/* Mobile action buttons */}
        <div className="px-3 py-4 space-y-3">
          {user ? (
            <>
              {!profileLoading && isCreator && (
                <RYButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    window.location.href = '/creator/upload';
                    closeMobileMenu();
                  }}
                  className="w-full"
                >
                  Upload Art
                </RYButton>
              )}
              <RYButton 
                variant="primary" 
                size="sm"
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                className="w-full"
              >
                Sign Out
              </RYButton>
            </>
          ) : (
            <>
              <RYButton 
                variant="secondary" 
                size="sm"
                onClick={handleBecomeCreatorClick}
                className="w-full"
              >
                Become a Creator
              </RYButton>
              <RYButton 
                variant="primary" 
                size="sm"
                onClick={handleSignInClick}
                className="w-full"
              >
                Sign In
              </RYButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
