
import React, { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DesktopNavLinksProps {
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  isAdmin: boolean;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  user,
  profileLoading,
  isCreator,
  isAdmin
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
      // Remove authentication requirement for this query
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'show_age_groups_in_nav')
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching navigation settings:', error);
        return;
      }
      
      // Default to true if no setting exists
      setShowAgeGroups(data?.setting_value !== 'false');
    } catch (error) {
      console.error('Error fetching navigation settings:', error);
      // Default to true on error
      setShowAgeGroups(true);
    }
  };

  return (
    <div className="hidden lg:block flex-1">
      <div className="flex items-center justify-center space-x-12 xl:space-x-16 2xl:space-x-20">
        <a href="/" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors">
          Home
        </a>
        <div className="relative group">
          <a href="/store" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors">
            Shop
          </a>
          {/* Shop dropdown */}
          <div className="absolute left-0 mt-1 w-48 bg-ry-white border border-ry-black rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              {/* Age groups section */}
              {showAgeGroups && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Shop by Age
                  </div>
                  <a href="/store?age=4-7" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 4-7</a>
                  <a href="/store?age=8-10" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 8-10</a>
                  <a href="/store?age=11-13" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 11-13</a>
                  <a href="/store?age=14-17" className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black">Ages 14-17</a>
                  {collections.length > 0 && <hr className="my-2 border-gray-200" />}
                </>
              )}
              
              {/* Collections section */}
              {collections.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Collections
                  </div>
                  {collections.map((collection) => (
                    <a 
                      key={collection.id}
                      href={`/collections/${collection.slug}`} 
                      className="block px-4 py-2 text-base text-ry-black hover:bg-ry-yellow hover:text-ry-black"
                    >
                      {collection.name}
                    </a>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <a href="/creators" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors">
          Creators
        </a>
        <a href="/training-program" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors">
          Future Founders
        </a>
        <a href="/how-it-works" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors">
          How It Works
        </a>
        <a href="/about" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors">
          About
        </a>
        
        {/* Dashboard Links for authenticated users */}
        {user && !profileLoading && (
          <>
            {isCreator && (
              <a href="/creator/dashboard" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors flex items-center">
                <User className="h-4 w-4 mr-1" />
                Creator Dashboard
              </a>
            )}
            {isAdmin && (
              <a href="/admin" className="text-ry-yellow hover:text-ry-white px-3 py-2 text-xl font-medium transition-colors flex items-center">
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
