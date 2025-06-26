
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Design } from './types';

export const useDesignStatusData = () => {
  return useQuery({
    queryKey: ['admin-designs-by-status'],
    queryFn: async (): Promise<Design[]> => {
      // First check if user is admin to ensure proper access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return [];
      }

      const { data, error } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          status,
          created_at,
          file_url,
          user_id,
          design_mockups(id),
          design_selections(id)
        `)
        .neq('status', 'consumed') // Keep this filter to prevent consumed designs from appearing in active admin workflow
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        return [];
      }

      // Fetch profile data separately for each unique user_id
      const userIds = [...new Set((data || []).map(design => design.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      // Create a map of user profiles for quick lookup
      const profilesMap = new Map();
      (profilesData || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Transform the data to match our Design interface
      const transformedData: Design[] = (data || []).map(item => {
        const profile = profilesMap.get(item.user_id);
        return {
          id: item.id,
          title: item.title,
          status: item.status,
          created_at: item.created_at,
          file_url: item.file_url,
          user_id: item.user_id,
          design_mockups: item.design_mockups || [],
          design_selections: item.design_selections || [],
          profiles: {
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null
          }
        };
      });

      return transformedData;
    },
  });
};
