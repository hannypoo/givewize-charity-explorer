import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, Building2, Loader2, AlertTriangle, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";

type SubmitResult = {
  status: "auto_approved" | "needs_review" | "needs_info" | "duplicate" | "error";
  charity_name?: string;
  score?: number;
  message?: string;
  charity_id?: string;
};

const COUNTRIES = [
  { value: "USA", label: "United States" },
  { value: "CAN", label: "Canada" },
  { value: "GBR", label: "United Kingdom" },
  { value: "AUS", label: "Australia" },
  { value: "DEU", label: "Germany" },
  { value: "FRA", label: "France" },
  { value: "IND", label: "India" },
  { value: "JPN", label: "Japan" },
  { value: "OTHER", label: "Other" },
];

const RequestCharity = () => {
  usePageTitle(
    "Request a Charity",
    "Suggest a charity you'd like to see on GiveWiZe. We review every submission."
  );

  const [charityName, setCharityName] = useState("");
  const [charityWebsite, setCharityWebsite] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [reason, setReason] = useState("");
  const [ein, setEin] = useState("");
  const [country, setCountry] = useState("USA");
  const [charityContactEmail, setCharityContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);

  const inputClasses =
    "w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charityName.trim() || !ein.trim()) return;

    setSubmitting(true);
    try {
      // Insert the charity request.
      // The id is generated client-side because the table is intentionally
      // insert-only for anonymous users (no SELECT policy — reading rows back
      // would expose other submitters' contact info).
      const requestId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("charity_requests")
        .insert({
          id: requestId,
          charity_name: charityName.trim(),
          charity_website: charityWebsite.trim() || null,
          requester_email: requesterEmail.trim() || null,
          requester_name: requesterName.trim() || null,
          reason: reason.trim() || null,
          ein: ein.trim() || null,
          country,
          charity_contact_email: charityContactEmail.trim() || null,
        });

      if (insertError) throw insertError;

      setSubmittedEmail(requesterEmail.trim());
      setSubmitting(false);
      setProcessing(true);

      // Invoke the processing Edge Function
      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        "process-charity-request",
        { body: { charity_request_id: requestId } }
      );

      if (fnError) {
        console.error("Edge function error:", fnError);
        // Still show success — the request was saved, just processing failed
        setResult({
          status: "needs_review",
          message: "Your request has been saved and will be reviewed manually by our team.",
        });
      } else if (fnData) {
        setResult(fnData as SubmitResult);
      } else {
        setResult({
          status: "needs_review",
          message: "Your request has been saved and will be reviewed by our team.",
        });
      }

      setSubmitted(true);
      toast.success("Charity request submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setResult(null);
    setCharityName("");
    setCharityWebsite("");
    setRequesterEmail("");
    setRequesterName("");
    setReason("");
    setEin("");
    setCountry("USA");
    setCharityContactEmail("");
  };

  const renderResult = () => {
    if (!result) {
      return (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Thank you!</h2>
          <p className="text-white/60 leading-relaxed">
            {submittedEmail
              ? <>We'll review your suggestion and contact you at{" "}
                  <span className="text-white font-medium">{submittedEmail}</span>{" "}
                  if we need more information.</>
              : "We'll review your suggestion. Thank you for helping us grow our directory!"}
          </p>
        </>
      );
    }

    switch (result.status) {
      case "auto_approved":
        return (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Charity Added!
            </h2>
            <p className="text-white/60 leading-relaxed">
              <span className="text-white font-medium">
                {result.charity_name || charityName}
              </span>{" "}
              has been automatically verified and added to GiveWiZe
              {result.score != null && (
                <> with a GiveWiZe Score of{" "}
                  <span className="text-orange-light font-semibold">
                    {result.score.toFixed(1)}/5.0
                  </span>
                </>
              )}
              . You can view their profile now!
            </p>
          </>
        );

      case "needs_info":
        return (
          <>
            <Clock className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Almost There!
            </h2>
            <p className="text-white/60 leading-relaxed">
              We've verified{" "}
              <span className="text-white font-medium">
                {result.charity_name || charityName}
              </span>{" "}
              but need a few more details to complete their profile. We've sent
              an email to the charity requesting the missing information.
            </p>
          </>
        );

      case "duplicate":
        return (
          <>
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Already Listed!
            </h2>
            <p className="text-white/60 leading-relaxed">
              {result.message || "This charity is already on GiveWiZe. Check our directory to find them!"}
            </p>
          </>
        );

      case "needs_review":
      default:
        return (
          <>
            <CheckCircle2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Under Review
            </h2>
            <p className="text-white/60 leading-relaxed">
              {result.message ||
                (submittedEmail
                  ? <>Your request has been saved. Our team will review it and notify you at{" "}
                      <span className="text-white font-medium">{submittedEmail}</span>{" "}
                      when it's been processed.</>
                  : "Your request has been saved. Our team will review it shortly.")}
            </p>
          </>
        );
    }
  };

  return (
    <Layout>
      <div className="bg-about min-h-screen -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-32 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] right-[15%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />

        <div className="container relative">
          {/* Hero */}
          <div className="py-16 md:py-24 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
              <Building2 className="h-4 w-4 text-orange-light" />
              <span className="text-sm font-medium text-white/80">Suggest a charity</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Request a Charity
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Don't see an organization you care about? Let us know and we'll review it.
            </p>
          </div>

          {/* Form / Result */}
          <div className="max-w-xl mx-auto pb-16">
            {processing ? (
              <div className="glass-dark rounded-2xl p-8 text-center">
                <Loader2 className="h-12 w-12 text-orange-light mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-white mb-2">Processing...</h2>
                <p className="text-white/60 leading-relaxed">
                  Verifying charity details and computing scores. This may take a moment.
                </p>
              </div>
            ) : submitted ? (
              <div className="glass-dark rounded-2xl p-8 text-center">
                {renderResult()}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {result?.charity_id ? (
                    <Link
                      to={`/charity/${result.charity_id}`}
                      className="inline-flex items-center gap-2 gradient-orange text-accent-foreground font-semibold px-6 py-2.5 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                    >
                      View Charity Profile
                    </Link>
                  ) : (
                    <Link
                      to="/charities"
                      className="inline-flex items-center gap-2 gradient-orange text-accent-foreground font-semibold px-6 py-2.5 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                    >
                      Explore Charities
                    </Link>
                  )}
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-white/25 bg-transparent text-white hover:bg-white/15 rounded-2xl"
                  >
                    Submit Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <label htmlFor="charityName" className="block text-sm font-medium text-white/80 mb-1.5">
                    Charity Name <span className="text-orange-light">*</span>
                  </label>
                  <input
                    id="charityName"
                    type="text"
                    required
                    value={charityName}
                    onChange={(e) => setCharityName(e.target.value)}
                    placeholder="e.g., Doctors Without Borders"
                    className={inputClasses}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ein" className="block text-sm font-medium text-white/80 mb-1.5">
                      EIN / Registration Number <span className="text-orange-light">*</span>
                    </label>
                    <input
                      id="ein"
                      type="text"
                      required
                      value={ein}
                      onChange={(e) => setEin(e.target.value)}
                      placeholder="XX-XXXXXXX"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-white/80 mb-1.5">
                      Country
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={inputClasses + " appearance-none cursor-pointer"}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value} className="bg-[#1a1f3a] text-white">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="charityWebsite" className="block text-sm font-medium text-white/80 mb-1.5">
                    Website URL
                  </label>
                  <input
                    id="charityWebsite"
                    type="url"
                    value={charityWebsite}
                    onChange={(e) => setCharityWebsite(e.target.value)}
                    placeholder="https://www.example.org"
                    className={inputClasses}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="requesterEmail" className="block text-sm font-medium text-white/80 mb-1.5">
                      Your Email
                    </label>
                    <input
                      id="requesterEmail"
                      type="email"
                      value={requesterEmail}
                      onChange={(e) => setRequesterEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="charityContactEmail" className="block text-sm font-medium text-white/80 mb-1.5">
                      Charity Contact Email
                    </label>
                    <input
                      id="charityContactEmail"
                      type="email"
                      value={charityContactEmail}
                      onChange={(e) => setCharityContactEmail(e.target.value)}
                      placeholder="info@charity.org"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="requesterName" className="block text-sm font-medium text-white/80 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="requesterName"
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Optional"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-white/80 mb-1.5">
                    Why should we add them?
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Tell us why this charity matters to you..."
                    className={inputClasses + " resize-none"}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !charityName.trim() || !ein.trim()}
                  className="w-full gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
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

export default RequestCharity;
