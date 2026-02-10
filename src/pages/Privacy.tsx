import { Layout } from "@/components/layout/Layout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Shield } from "lucide-react";

const Privacy = () => {
  usePageTitle("Privacy Policy", "Learn how GiveWiZe collects, uses, and protects your personal information.");

  return (
    <Layout>
      <div className="bg-about min-h-screen -mt-16 pt-16 relative overflow-hidden">
        <div className="absolute top-32 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] right-[15%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />

        <div className="container relative">
          <div className="py-16 md:py-24 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
              <Shield className="h-4 w-4 text-orange-light" />
              <span className="text-sm font-medium text-white/80">Your privacy matters</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Last updated: February 2026
            </p>
          </div>

          <div className="max-w-3xl mx-auto pb-16 space-y-8">
            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Information We Collect</h2>
              <p className="text-white/60 leading-relaxed">
                GiveWiZe collects only the information necessary to provide our services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li><strong className="text-white/80">Account information:</strong> Email address and display name when you create an account</li>
                <li><strong className="text-white/80">Usage data:</strong> Your favorites, quiz responses, and donation receipts you choose to track</li>
                <li><strong className="text-white/80">Employer matching:</strong> Employer name and match details if you opt in to employer matching</li>
              </ul>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">How We Use Your Data</h2>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li>Providing personalized charity recommendations</li>
                <li>Saving your favorites and quiz results</li>
                <li>Tracking donation receipts you enter</li>
                <li>Facilitating employer match requests</li>
              </ul>
              <p className="text-white/60 leading-relaxed">
                We do not sell, rent, or share your personal information with third parties for marketing purposes.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Data Security</h2>
              <p className="text-white/60 leading-relaxed">
                Your data is stored securely using Supabase with Row Level Security (RLS) policies. Each user can only access their own data. All connections are encrypted via HTTPS.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Data Deletion</h2>
              <p className="text-white/60 leading-relaxed">
                You can delete your account and all associated data at any time from your profile page. This permanently removes your account, favorites, donation receipts, quiz results, and employer match requests.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Cookies & Local Storage</h2>
              <p className="text-white/60 leading-relaxed">
                GiveWiZe uses browser local storage to save your authentication session and quiz progress. We do not use third-party tracking cookies or analytics services.
              </p>
            </section>

            <section className="glass-dark rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Contact</h2>
              <p className="text-white/60 leading-relaxed">
                If you have questions about this privacy policy, contact us at{" "}
                <a href="mailto:admin@givewize.org" className="text-orange-light hover:underline">admin@givewize.org</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
