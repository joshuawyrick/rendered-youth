
import React, { useState, useEffect } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface Collection {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
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
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showAgeGroups, setShowAgeGroups] = useState(true);

  useEffect(() => {
    fetchCollections();
    fetchNavigationSettings();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('id, name, slug, is_active, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchNavigationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'show_age_groups_in_nav')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching navigation settings:', error);
        return;
      }
      
      setShowAgeGroups(data?.setting_value !== 'false');
    } catch (error) {
      console.error('Error fetching navigation settings:', error);
      setShowAgeGroups(true);
    }
  };

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      closeMobileMenu();
    } catch (error) {
      console.error('Sign out error:', error);
      closeMobileMenu();
    }
  };

  if (!isMobileMenuOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeMobileMenu}
      />
      
      {/* Mobile menu panel */}
      <div className="absolute top-16 left-0 right-0 bottom-0 bg-ry-black border-t border-ry-yellow shadow-lg overflow-y-auto">
        <div className="px-4 py-2 space-y-1 text-center">
          <a 
            href="/" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
            onClick={closeMobileMenu}
          >
            Home
          </a>
          <a 
            href="/store" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
            onClick={closeMobileMenu}
          >
            Shop
          </a>
          
          {/* Mobile Shop submenu */}
          <div className="pl-6 space-y-1">
            {/* Age groups */}
            {showAgeGroups && (
              <>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2">
                  Shop by Age
                </div>
                <a 
                  href="/store?age=4-7" 
                  className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
                  onClick={closeMobileMenu}
                >
                  Ages 4-7
                </a>
                <a 
                  href="/store?age=8-10" 
                  className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
                  onClick={closeMobileMenu}
                >
                  Ages 8-10
                </a>
                <a 
                  href="/store?age=11-13" 
                  className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
                  onClick={closeMobileMenu}
                >
                  Ages 11-13
                </a>
                <a 
                  href="/store?age=14-17" 
                  className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
                  onClick={closeMobileMenu}
                >
                  Ages 14-17
                </a>
              </>
            )}

            {/* Collections */}
            {collections.length > 0 && (
              <>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2">
                  Collections
                </div>
                {collections.map((collection) => (
                  <a 
                    key={collection.id}
                    href={`/collections/${collection.slug}`} 
                    className="block text-ry-yellow hover:text-ry-white px-3 py-2 text-base transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {collection.name}
                  </a>
                ))}
                <div className="border-b border-gray-700 mt-2"></div>
              </>
            )}
          </div>

          <a 
            href="/creators" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
            onClick={closeMobileMenu}
          >
            Creators
          </a>
          <a 
            href="/training-program" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
            onClick={closeMobileMenu}
          >
            Future Founders
          </a>
          <a 
            href="/how-it-works" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
            onClick={closeMobileMenu}
          >
            How It Works
          </a>
          <a 
            href="/about" 
            className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
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
                  className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
                  onClick={closeMobileMenu}
                >
                  <User className="h-4 w-4 mr-2 inline" />
                  Creator Dashboard
                </a>
              )}
              {isAdmin && (
                <a 
                  href="/admin" 
                  className="block text-ry-yellow hover:text-ry-white px-3 py-3 text-lg font-medium transition-colors border-b border-gray-700"
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
                  onClick={handleSignOut}
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
    </div>
  );
};

export default MobileMenu;
