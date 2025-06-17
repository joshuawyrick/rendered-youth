import React, { useState, useEffect } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Search, Settings, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

const TopNav = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user) {
      checkUserRoles();
    } else {
      setIsAdmin(false);
      setIsCreator(false);
    }
  }, [user]);

  const checkUserRoles = async () => {
    if (!user) return;

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    setIsAdmin(!!adminData);

    // Check if user is a creator by checking their profile account_type
    const { data: profileData } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();

    setIsCreator(profileData?.account_type === 'creator');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-ry-black shadow-md z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="block">
              <img 
                src="/lovable-uploads/23f0546f-a058-438f-a6f8-2cb6f7352d35.png" 
                alt="Rendered Youth" 
                className="h-8 sm:h-10 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
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
              <a href="/how-it-works" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                How It Works
              </a>
              <a href="/about" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
              
              {/* Dashboard Links for authenticated users */}
              {user && (
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

          {/* Right side buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <Search className="h-5 w-5 text-ry-yellow hover:text-ry-white cursor-pointer transition-colors" />
            
            {user ? (
              <>
                {isCreator && (
                  <RYButton 
                    variant="secondary" 
                    size="sm"
                    onClick={() => window.location.href = '/creator/upload'}
                    className="text-xs xl:text-sm"
                  >
                    Upload Art
                  </RYButton>
                )}
                <RYButton 
                  variant="primary" 
                  size="sm"
                  onClick={signOut}
                  className="text-xs xl:text-sm"
                >
                  Sign Out
                </RYButton>
              </>
            ) : (
              <>
                <RYButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = '/age-verification'}
                  className="text-xs xl:text-sm"
                >
                  Become a Creator
                </RYButton>
                <RYButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                  className="text-xs xl:text-sm"
                >
                  Sign In
                </RYButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-ry-yellow hover:text-ry-white transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
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
              {user && (
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
                    {isCreator && (
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
                      onClick={() => {
                        window.location.href = '/age-verification';
                        closeMobileMenu();
                      }}
                      className="w-full"
                    >
                      Become a Creator
                    </RYButton>
                    <RYButton 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        window.location.href = '/auth';
                        closeMobileMenu();
                      }}
                      className="w-full"
                    >
                      Sign In
                    </RYButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
