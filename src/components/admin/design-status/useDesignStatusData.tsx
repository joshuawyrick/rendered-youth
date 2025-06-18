
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Design } from './types';

export const useDesignStatusData = () => {
  return useQuery({
    queryKey: ['admin-designs-by-status'],
    queryFn: async (): Promise<Design[]> => {
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
          design_selections(id),
          profiles:user_id(first_name, last_name)
        `)
        .neq('status', 'consumed') // Filter out consumed designs
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        return [];
      }

      // Transform the data to match our Design interface
      const transformedData: Design[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        status: item.status,
        created_at: item.created_at,
        file_url: item.file_url,
        user_id: item.user_id,
        design_mockups: item.design_mockups || [],
        design_selections: item.design_selections || [],
        profiles: {
          first_name: item.profiles?.first_name || null,
          last_name: item.profiles?.last_name || null
        }
      }));

      return transformedData;
    },
  });
};
