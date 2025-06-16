
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

    const { designId } = await req.json();

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

    if (!user?.email) {
      throw new Error('User email not found');
    }

    // Check notification preferences
    const { data: notifSettings } = await supabaseClient
      .from('notification_settings')
      .select('email_on_review_ready')
      .eq('user_id', design.user_id)
      .single();

    // Only send if user has notifications enabled (default true)
    if (notifSettings?.email_on_review_ready !== false) {
      // Note: You'll need to implement the actual email sending here
      // This would typically use a service like Resend
      console.log(`Would send review notification to ${user.email} for design: ${design.title}`);
      
      // For now, just log the notification
      // In production, integrate with Resend or another email service
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
