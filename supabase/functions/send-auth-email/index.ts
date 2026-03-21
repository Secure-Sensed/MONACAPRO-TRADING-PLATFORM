import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "no-reply@monacaptradingpro.com";

const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend error: ${message}`);
  }
};

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response("Missing Supabase env", { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? ""
        }
      }
    });

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { type } = await req.json();
    const normalizedType = typeof type === "string" ? type.toLowerCase() : "";

    const subject = normalizedType === "login"
      ? "New login to your Monacap Trading Pro account"
      : "Welcome to Monacap Trading Pro";

    const heading = normalizedType === "login"
      ? "We noticed a new login to your account"
      : "Welcome to Monacap Trading Pro";

    const body = normalizedType === "login"
      ? "If this was you, no action is needed. If not, please reset your password immediately."
      : "Your account has been created successfully. You can now start trading and exploring the platform.";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2>${heading}</h2>
        <p>Hi ${user.user_metadata?.full_name ?? "there"},</p>
        <p>${body}</p>
        <p style="color: #64748b;">If you have any questions, reply to this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email ?? "",
      subject,
      html
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error?.message ?? String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
