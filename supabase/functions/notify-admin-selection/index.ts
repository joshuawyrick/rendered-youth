
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { designId, selectedMockupId } = await req.json();

    // Get design and user details
    const { data: design } = await supabaseClient
      .from('designs')
      .select(`
        id,
        title,
        user_id
      `)
      .eq('id', designId)
      .single();

    if (!design) {
      throw new Error('Design not found');
    }

    // Get user email from auth.users
    const { data: { user } } = await supabaseClient.auth.admin.getUserById(design.user_id);

    // Get all admin users
    const { data: adminUsers } = await supabaseClient
      .from('admin_users')
      .select('user_id');

    if (adminUsers && adminUsers.length > 0) {
      // For now, just log the notification
      // In production, integrate with Resend or another email service
      console.log(`Admin notification: Creator ${user?.email || 'Unknown'} has selected their favorite design for "${design.title}"`);
      console.log(`Design ID: ${designId}, Selected Mockup ID: ${selectedMockupId}`);
      
      // You can add email sending logic here using Resend
      // Similar to the send-review-notification function
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
