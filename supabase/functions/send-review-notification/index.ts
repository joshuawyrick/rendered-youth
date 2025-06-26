
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
    console.log('Processing review notification for design:', designId);

    // Get design and user details
    const { data: design, error: designError } = await supabaseClient
      .from('designs')
      .select(`
        id,
        title,
        user_id
      `)
      .eq('id', designId)
      .single();

    if (designError || !design) {
      console.error('Design fetch error:', designError);
      throw new Error('Design not found');
    }

    console.log('Design found:', design.title);

    // Get user email from auth.users
    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(design.user_id);

    if (userError || !user?.email) {
      console.error('User fetch error:', userError);
      throw new Error('User email not found');
    }

    console.log('User email found:', user.email);

    // Check notification preferences
    const { data: notifSettings } = await supabaseClient
      .from('notification_settings')
      .select('email_on_review_ready')
      .eq('user_id', design.user_id)
      .single();

    // Only send if user has notifications enabled (default true)
    if (notifSettings?.email_on_review_ready !== false) {
      console.log(`Sending review notification to ${user.email} for design: ${design.title}`);
      
      // Try to send email using Resend if API key is available
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      
      if (resendApiKey) {
        try {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Rendered Youth <noreply@renderedyouth.com>',
              to: [user.email],
              subject: 'Your Design is Ready for Review!',
              html: `
                <h2>Great news! Your design "${design.title}" is ready for review.</h2>
                <p>We've created mockups for your design and it's now ready for you to review and make your final selection.</p>
                <p><a href="https://renderedyouth.com/design-review/${designId}" style="background-color: #FFD700; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Your Design</a></p>
                <p>Once you select your preferred mockup, we'll publish your design to the store!</p>
                <p>Best regards,<br>The Rendered Youth Team</p>
              `,
            }),
          });

          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error('Resend API error:', errorText);
            throw new Error('Failed to send email via Resend');
          }

          const emailResult = await emailResponse.json();
          console.log('Email sent successfully via Resend:', emailResult.id);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Continue without failing the entire function
        }
      } else {
        console.log('RESEND_API_KEY not configured, email notification skipped');
      }
    } else {
      console.log('User has disabled email notifications');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification processed' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
