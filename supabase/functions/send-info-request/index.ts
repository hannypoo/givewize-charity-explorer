import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// ── Claude API helper ────────────────────────────────────────────────

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024,
): Promise<string | null> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set");
    return null;
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      console.error("Claude API error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? null;
  } catch (e) {
    console.error("Claude API call failed:", e);
    return null;
  }
}

// ── Agent 3: Email Personalization Agent ─────────────────────────────

const EMAIL_PERSONALIZATION_PROMPT = `You are writing a professional outreach email on behalf of GiveWiZe, a charity discovery platform. Write a warm, personalized email body to a nonprofit asking them to complete their profile.

Context about the charity will be provided. Use it to make the email feel personal, not generic.

Return ONLY the email body HTML (no subject line, no <html>/<body> tags — just the content paragraphs and list). Use inline styles consistent with: color:#cbd5e1 for body text, color:#e2e8f0 for list items, font-size:15px, line-height:1.7.

Structure:
1. A greeting that references something specific about their work
2. Brief explanation of GiveWiZe and why a complete profile helps donors find them
3. The list of missing information we need (provided to you)
4. A closing that's encouraging, not demanding

Keep it under 200 words. Professional but warm. No emojis.`;

async function personalizeEmailWithClaude(
  charityName: string,
  mission: string | null,
  programs: string[] | null,
  missingFieldLabels: string[],
): Promise<{ html: string | null; metrics: { used_claude: boolean; fallback_used: boolean; duration_ms: number } }> {
  const metrics = { used_claude: false, fallback_used: false, duration_ms: 0 };
  const start = Date.now();

  const context = [
    `Charity name: ${charityName}`,
    mission ? `Mission: ${mission}` : null,
    programs && programs.length > 0 ? `Programs: ${programs.join(", ")}` : null,
    `Missing information we need: ${missingFieldLabels.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await callClaude(
    EMAIL_PERSONALIZATION_PROMPT,
    context,
    1024,
  );
  metrics.duration_ms = Date.now() - start;

  if (!raw) return { html: null, metrics };

  metrics.used_claude = true;
  // Strip markdown fences if present (try multiple strategies)
  const fenceMatch = raw.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/i);
  const cleaned = fenceMatch?.[1]?.trim() ?? raw.trim();
  return { html: cleaned, metrics };
}

const FIELD_LABELS: Record<string, string> = {
  mission_statement: "Mission Statement",
  website: "Organization Website",
  primary_category: "Primary Cause Category",
  program_expense_percentage: "Program Expense Percentage",
  admin_expense_percentage: "Administrative Expense Percentage",
  fundraising_expense_percentage: "Fundraising Expense Percentage",
  year_founded: "Year Founded",
  people_served_annually: "Number of People Served Annually",
  programs_list: "List of Programs",
  geographic_scope: "Geographic Scope (Local/National/Global)",
  full_description: "Full Organization Description",
  annual_report_url: "Annual Report URL",
  target_population: "Target Population",
};

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function buildEmailHtml(
  charityName: string,
  missingFieldsLabels: string[],
  submitUrl: string
): string {
  const listItems = missingFieldsLabels
    .map(
      (label) =>
        `<li style="margin-bottom:8px;color:#e2e8f0;font-size:15px;">${label}</li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Complete your ${charityName} profile on GiveWiZe</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1225;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1225;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1f3a 0%,#2d1b69 100%);padding:32px 40px;text-align:center;">
              <span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Give<span style="color:#f97316;">Wi</span>Ze</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#1e2340;padding:40px;">
              <p style="margin:0 0 20px;color:#f1f5f9;font-size:16px;line-height:1.6;">
                Hello ${charityName} team,
              </p>
              <p style="margin:0 0 20px;color:#cbd5e1;font-size:15px;line-height:1.7;">
                We're adding your organization to GiveWiZe, a charity discovery platform. To complete your profile, we need a few more details:
              </p>
              <ul style="margin:0 0 28px;padding-left:24px;list-style-type:disc;">
                ${listItems}
              </ul>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" style="border-radius:9999px;background-color:#f97316;">
                    <a href="${submitUrl}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:9999px;">
                      Complete Your Profile
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 0;color:#94a3b8;font-size:13px;line-height:1.5;text-align:center;">
                This link expires in 30 days.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#161936;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
                Questions? Reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function buildPersonalizedEmailHtml(
  personalizedBody: string,
  submitUrl: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Complete your profile on GiveWiZe</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1225;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1225;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1f3a 0%,#2d1b69 100%);padding:32px 40px;text-align:center;">
              <span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Give<span style="color:#f97316;">Wi</span>Ze</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#1e2340;padding:40px;">
              ${personalizedBody}
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" style="border-radius:9999px;background-color:#f97316;">
                    <a href="${submitUrl}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:9999px;">
                      Complete Your Profile
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 0;color:#94a3b8;font-size:13px;line-height:1.5;text-align:center;">
                This link expires in 30 days.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#161936;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
                Questions? Reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      charity_request_id,
      contact_email,
      missing_fields,
      charity_name,
      mission_statement,
      programs_list,
    } = await req.json();

    // Validate required fields
    if (
      !charity_request_id ||
      !contact_email ||
      !missing_fields?.length ||
      !charity_name
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: charity_request_id, contact_email, missing_fields, charity_name",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") || "https://givewize.com";

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Generate secure token
    const token = generateToken();

    // Build human-readable labels for missing fields
    const missingFieldsLabels: Record<string, string> = {};
    for (const field of missing_fields) {
      missingFieldsLabels[field] = FIELD_LABELS[field] || field;
    }

    // Calculate expiration (30 days from now)
    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Insert request record into charity_info_requests
    const { error: insertError } = await supabase
      .from("charity_info_requests")
      .insert({
        charity_request_id,
        token,
        contact_email,
        missing_fields,
        missing_fields_labels: missingFieldsLabels,
        status: "pending",
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Failed to insert charity_info_request:", insertError);
      return new Response(
        JSON.stringify({
          error: "Failed to create info request record",
          details: insertError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build email HTML
    const submitUrl = `${siteUrl}/submit-charity-info/${token}`;
    const labelsList = missing_fields.map(
      (field: string) => FIELD_LABELS[field] || field
    );

    // ── Agent 3: Try Claude personalization, fall back to template ──
    let html: string;
    let emailMetrics = { used_claude: false, fallback_used: false, duration_ms: 0 };

    const { html: personalizedBody, metrics: agent3Metrics } =
      await personalizeEmailWithClaude(
        charity_name,
        mission_statement ?? null,
        programs_list ?? null,
        labelsList,
      );
    emailMetrics = agent3Metrics;

    if (personalizedBody) {
      console.log("Agent 3: Using Claude-personalized email");
      html = buildPersonalizedEmailHtml(personalizedBody, submitUrl);
    } else {
      console.log("Agent 3: Falling back to template email");
      emailMetrics.fallback_used = true;
      html = buildEmailHtml(charity_name, labelsList, submitUrl);
    }

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GiveWiZe <noreply@givewize.org>",
        to: contact_email,
        subject: `Complete your ${charity_name} profile on GiveWiZe`,
        html,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          details: resendData,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Info request email sent to ${contact_email}`,
        email_id: resendData.id,
        token,
        agent3_metrics: emailMetrics,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error in send-info-request:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
