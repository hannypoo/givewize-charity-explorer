import { Layout } from "@/components/layout/Layout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FileText } from "lucide-react";

const Terms = () => {
  usePageTitle("Terms of Service", "Read the terms and conditions for using GiveWiZe.");

  return (
    <Layout>
      <div className="bg-about min-h-screen -mt-16 pt-16 relative overflow-hidden">
        <div className="absolute top-32 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] right-[15%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />

        <div className="container relative">
          <div className="py-16 md:py-24 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
              <FileText className="h-4 w-4 text-orange-light" />
              <span className="text-sm font-medium text-white/80">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Last updated: February 2026
            </p>
          </div>

          <div className="max-w-3xl mx-auto pb-16 space-y-8">
            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Acceptance of Terms</h2>
              <p className="text-white/60 leading-relaxed">
                By using GiveWiZe, you agree to these terms of service. If you do not agree, please do not use the platform.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">About GiveWiZe</h2>
              <p className="text-white/60 leading-relaxed">
                GiveWiZe is a free charity discovery and evaluation tool. We are not a nonprofit organization. We do not process donations, solicit funds, or act as a financial intermediary. When you decide to donate, you will be directed to the charity's own website.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Ratings & Scores</h2>
              <p className="text-white/60 leading-relaxed">
                GiveWiZe scores and ratings are based on publicly available data including IRS filings, financial reports, and community reviews. Scores are informational only and should not be the sole factor in your giving decisions. We do not guarantee the accuracy or completeness of any data or rating.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">User Accounts</h2>
              <p className="text-white/60 leading-relaxed">
                You are responsible for maintaining the security of your account credentials. You may delete your account at any time from your profile page. We reserve the right to suspend accounts that violate these terms.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">User-Generated Content</h2>
              <p className="text-white/60 leading-relaxed">
                Reviews and other content you submit must be truthful and based on genuine experience. We reserve the right to remove content that is abusive, misleading, or violates these terms.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Limitation of Liability</h2>
              <p className="text-white/60 leading-relaxed">
                GiveWiZe is provided "as is" without warranties of any kind. We are not liable for any decisions you make based on information provided on this platform. Always do your own research before making charitable contributions.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Changes to Terms</h2>
              <p className="text-white/60 leading-relaxed">
                We may update these terms from time to time. Continued use of GiveWiZe after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Contact</h2>
              <p className="text-white/60 leading-relaxed">
                Questions about these terms? Contact us at{" "}
                <a href="mailto:admin@givewize.org" className="text-orange-light hover:underline">admin@givewize.org</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
