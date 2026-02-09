import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, Building2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";

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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charityName.trim() || !requesterEmail.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("charity_requests").insert({
        charity_name: charityName.trim(),
        charity_website: charityWebsite.trim() || null,
        requester_email: requesterEmail.trim(),
        requester_name: requesterName.trim() || null,
        reason: reason.trim() || null,
      });

      if (error) throw error;

      setSubmittedEmail(requesterEmail.trim());
      setSubmitted(true);
      toast.success("Charity request submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
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

          {/* Form */}
          <div className="max-w-xl mx-auto pb-16">
            {submitted ? (
              <div className="glass-dark rounded-2xl p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Thank you!</h2>
                <p className="text-white/60 leading-relaxed">
                  We'll review your suggestion and contact you at{" "}
                  <span className="text-white font-medium">{submittedEmail}</span>{" "}
                  if we need more information.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setCharityName("");
                      setCharityWebsite("");
                      setRequesterEmail("");
                      setRequesterName("");
                      setReason("");
                    }}
                    variant="outline"
                    className="border-white/25 text-white hover:bg-white/15 rounded-2xl"
                  >
                    Submit Another
                  </Button>
                  <Link
                    to="/charities"
                    className="inline-flex items-center gap-2 gradient-orange text-accent-foreground font-semibold px-6 py-2.5 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                  >
                    Explore Charities
                  </Link>
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
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50"
                  />
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
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50"
                  />
                </div>

                <div>
                  <label htmlFor="requesterEmail" className="block text-sm font-medium text-white/80 mb-1.5">
                    Your Email <span className="text-orange-light">*</span>
                  </label>
                  <input
                    id="requesterEmail"
                    type="email"
                    required
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50"
                  />
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
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50"
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
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !charityName.trim() || !requesterEmail.trim()}
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
