
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Collection {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

export const useMobileMenuData = () => {
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

  return { collections, showAgeGroups };
};
