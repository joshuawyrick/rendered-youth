
import React, { useState, useEffect } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Search, Settings, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const TopNav = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

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

    // Check if user is a creator (has uploaded designs)
    const { data: designsData } = await supabase
      .from('designs')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    setIsCreator(!!designsData && designsData.length > 0);
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
                className="h-10 w-auto"
              />
            </a>
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

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-ry-yellow hover:text-ry-white cursor-pointer transition-colors" />
            
            {user ? (
              <>
                <RYButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = '/creator/upload'}
                >
                  Upload Art
                </RYButton>
                <RYButton 
                  variant="primary" 
                  size="sm"
                  onClick={signOut}
                >
                  Sign Out
                </RYButton>
              </>
            ) : (
              <>
                <RYButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = '/creator/upload'}
                >
                  Upload Art
                </RYButton>
                <RYButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In
                </RYButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
