
import { supabase } from '@/integrations/supabase/client';

export const commissionService = {
  // Get the current creator commission rate
  async getCreatorCommissionRate(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'creator_commission_rate')
        .single();

      if (error) {
        console.error('Error fetching commission rate:', error);
        return 0.70; // Default fallback
      }

      return parseFloat(data.setting_value);
    } catch (error) {
      console.error('Error in getCreatorCommissionRate:', error);
      return 0.70; // Default fallback
    }
  },

  // Update the creator commission rate (admin only)
  async updateCreatorCommissionRate(newRate: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ 
          setting_value: newRate.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'creator_commission_rate');

      if (error) {
        console.error('Error updating commission rate:', error);
        return false;
      }

      console.log('Commission rate updated to:', newRate);
      return true;
    } catch (error) {
      console.error('Error in updateCreatorCommissionRate:', error);
      return false;
    }
  },

  // Calculate earnings split based on sale amount
  calculateEarningsSplit(saleAmount: number, commissionRate: number) {
    const creatorShare = saleAmount * commissionRate;
    const platformFee = saleAmount - creatorShare;
    
    return {
      gross_amount: saleAmount,
      creator_share: creatorShare,
      platform_fee: platformFee,
      commission_rate: commissionRate
    };
  },

  // Record creator earnings for a sale (when implemented)
  async recordCreatorEarning(saleData: {
    creator_user_id: string;
    product_id: string;
    sale_id: string;
    gross_amount: number;
    commission_rate: number;
  }) {
    try {
      const split = this.calculateEarningsSplit(saleData.gross_amount, saleData.commission_rate);
      
      const { data, error } = await supabase
        .from('creator_earnings')
        .insert({
          creator_user_id: saleData.creator_user_id,
          product_id: saleData.product_id,
          sale_id: saleData.sale_id,
          ...split
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording creator earning:', error);
        return null;
      }

      console.log('Creator earning recorded:', data);
      return data;
    } catch (error) {
      console.error('Error in recordCreatorEarning:', error);
      return null;
    }
  }
};
