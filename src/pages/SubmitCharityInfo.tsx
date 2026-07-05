import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Clock, Send, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";
import { Constants } from "@/integrations/supabase/types";

type InfoRequest = {
  id: string;
  charity_request_id: string;
  token: string;
  contact_email: string;
  missing_fields: string[];
  missing_fields_labels: Record<string, string>;
  status: string;
  expires_at: string;
};

const FIELD_CONFIG: Record<string, { type: string; placeholder: string; rows?: number; options?: { value: string; label: string }[] }> = {
  mission_statement: { type: "textarea", placeholder: "Describe your organization's mission...", rows: 3 },
  full_description: { type: "textarea", placeholder: "A detailed description of your organization...", rows: 4 },
  website: { type: "url", placeholder: "https://www.yourorg.org" },
  primary_category: {
    type: "select",
    placeholder: "Select a category",
    options: Constants.public.Enums.cause_category.map((cat) => ({
      value: cat,
      label: cat
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    })),
  },
  geographic_scope: {
    type: "select",
    placeholder: "Select scope",
    options: [
      { value: "local", label: "Local" },
      { value: "national", label: "National" },
      { value: "global", label: "Global" },
    ],
  },
  program_expense_percentage: { type: "number", placeholder: "e.g., 85" },
  admin_expense_percentage: { type: "number", placeholder: "e.g., 10" },
  fundraising_expense_percentage: { type: "number", placeholder: "e.g., 5" },
  year_founded: { type: "number", placeholder: "e.g., 1990" },
  people_served_annually: { type: "number", placeholder: "e.g., 50000" },
  programs_list: { type: "textarea", placeholder: "List programs, one per line", rows: 4 },
  annual_report_url: { type: "url", placeholder: "https://www.yourorg.org/annual-report" },
  target_population: { type: "text", placeholder: "e.g., Children in rural communities" },
};

const SubmitCharityInfo = () => {
  usePageTitle(
    "Complete Charity Profile",
    "Help us complete your charity's profile on GiveWiZe by providing missing information."
  );

  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [infoRequest, setInfoRequest] = useState<InfoRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputClasses =
    "w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50";

  useEffect(() => {
    const fetchInfoRequest = async () => {
      if (!token) {
        setError("Invalid link. No token provided.");
        setLoading(false);
        return;
      }

      // Token-gated lookup via SECURITY DEFINER function — the table itself has
      // no public SELECT policy (it holds contact emails). Possessing the emailed
      // token is the authorization. Cast needed until Supabase types are regenerated.
      const { data, error: fetchErr } = await (supabase as any)
        .rpc("get_charity_info_request", { p_token: token })
        .single();

      if (fetchErr || !data) {
        setError("This link is invalid or has already been used.");
        setLoading(false);
        return;
      }

      if (data.status !== "pending") {
        setError(
          data.status === "submitted"
            ? "This form has already been submitted. Thank you!"
            : data.status === "expired"
            ? "This link has expired. Please contact us for a new one."
            : "This request has already been processed."
        );
        setLoading(false);
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError("This link has expired. Please contact us for a new one.");
        setLoading(false);
        return;
      }

      setInfoRequest(data as InfoRequest);

      // Initialize form data
      const initial: Record<string, string> = {};
      for (const field of data.missing_fields) {
        initial[field] = "";
      }
      setFormData(initial);
      setLoading(false);
    };

    fetchInfoRequest();
  }, [token]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoRequest) return;

    setSubmitting(true);
    try {
      // Transform form data — convert number fields, split programs_list
      const processedData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (!value.trim()) continue;

        const config = FIELD_CONFIG[key];
        if (config?.type === "number") {
          processedData[key] = parseFloat(value);
        } else if (key === "programs_list") {
          processedData[key] = value
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          processedData[key] = value.trim();
        }
      }

      // Submit via SECURITY DEFINER function (token-gated; table has no public
      // UPDATE policy). Returns false if the token is invalid or already used.
      const { data: ok, error: updateErr } = await (supabase as any).rpc(
        "submit_charity_info",
        { p_token: token, p_data: processedData }
      );

      if (updateErr || !ok) throw updateErr ?? new Error("Submission was not accepted.");

      // Re-invoke the processing function
      await supabase.functions.invoke("process-charity-request", {
        body: { charity_request_id: infoRequest.charity_request_id },
      });

      setSubmitted(true);
      toast.success("Information submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: string) => {
    const config = FIELD_CONFIG[field] || { type: "text", placeholder: "" };
    const label =
      (infoRequest?.missing_fields_labels as Record<string, string>)?.[field] ||
      field
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return (
      <div key={field}>
        <label htmlFor={field} className="block text-sm font-medium text-white/80 mb-1.5">
          {label}
        </label>
        {config.type === "textarea" ? (
          <textarea
            id={field}
            value={formData[field] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            rows={config.rows || 3}
            placeholder={config.placeholder}
            className={inputClasses + " resize-none"}
          />
        ) : config.type === "select" ? (
          <select
            id={field}
            value={formData[field] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={inputClasses + " appearance-none cursor-pointer"}
          >
            <option value="" className="bg-[#1a1f3a] text-white/50">
              {config.placeholder}
            </option>
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1a1f3a] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field}
            type={config.type}
            value={formData[field] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={config.placeholder}
            className={inputClasses}
          />
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-about min-h-screen -mt-16 pt-16 relative overflow-hidden">
        <div className="absolute top-32 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] right-[15%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />

        <div className="container relative">
          <div className="py-16 md:py-24 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Complete Your Profile
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Help us build an accurate profile for your organization on GiveWiZe.
            </p>
          </div>

          <div className="max-w-xl mx-auto pb-16">
            {loading ? (
              <div className="glass-dark rounded-2xl p-8 text-center">
                <Loader2 className="h-12 w-12 text-orange-light mx-auto mb-4 animate-spin" />
                <p className="text-white/60">Loading your form...</p>
              </div>
            ) : error ? (
              <div className="glass-dark rounded-2xl p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Oops</h2>
                <p className="text-white/60 leading-relaxed">{error}</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 mt-6 gradient-orange text-accent-foreground font-semibold px-6 py-2.5 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                >
                  Go Home
                </Link>
              </div>
            ) : submitted ? (
              <div className="glass-dark rounded-2xl p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
                <p className="text-white/60 leading-relaxed">
                  Your information has been submitted. We'll process your profile and it should appear
                  on GiveWiZe shortly.
                </p>
                <Link
                  to="/charities"
                  className="inline-flex items-center gap-2 mt-6 gradient-orange text-accent-foreground font-semibold px-6 py-2.5 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                >
                  Explore Charities
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-6 md:p-8 space-y-5">
                <div className="pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-light" />
                    <span className="text-sm text-white/60">
                      Expires{" "}
                      {infoRequest?.expires_at
                        ? new Date(infoRequest.expires_at).toLocaleDateString()
                        : "in 14 days"}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">
                    Please fill in as many fields as possible. The more data you provide, the more
                    complete your profile will be.
                  </p>
                </div>

                {infoRequest?.missing_fields.map(renderField)}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Information
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitCharityInfo;
