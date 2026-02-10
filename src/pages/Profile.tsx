import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProfileSectionNav } from "@/components/charities/ProfileSectionNav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { MyCharities } from "@/components/profile/MyCharities";
import { DonationReceipts } from "@/components/profile/DonationReceipts";
import { QuizMatchesSection } from "@/components/profile/QuizMatchesSection";
import { EmployerMatching } from "@/components/profile/EmployerMatching";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "my-charities", label: "My Charities" },
  { id: "donation-receipts", label: "Donation Receipts" },
  { id: "quiz-matches", label: "Quiz & Matches" },
  { id: "employer-matching", label: "Employer Matching" },
];

const sectionIds = SECTIONS.map((s) => s.id);

const Profile = () => {
  usePageTitle("My Profile", "Manage your GiveWiZe profile, favorite charities, donation receipts, quiz results, and employer matching.");
  const { user, profile } = useAuth();
  const { activeSection, scrollToSection } = useActiveSection(sectionIds);
  const location = useLocation();

  // Handle hash navigation from other pages (e.g. /profile#employer-matching)
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && sectionIds.includes(hash)) {
      // Small delay to let the page render before scrolling
      const timer = setTimeout(() => scrollToSection(hash), 300);
      return () => clearTimeout(timer);
    }
  }, [location.hash, scrollToSection]);

  return (
    <Layout>
      {/* Hero */}
      <div
        className="relative -mt-16 pt-16"
        style={{ background: "linear-gradient(135deg, hsl(220, 72%, 50%), hsl(220, 60%, 40%))" }}
      >
        <div className="container py-8 md:py-12">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
              {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
                {profile?.display_name || "My Profile"}
              </h1>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <ProfileSectionNav
        sections={SECTIONS}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <div className="bg-secondary min-h-screen">
        <div className="container py-8 md:py-10 space-y-12">
          <section id="overview" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
            <ProfileOverview />
          </section>

          <section id="my-charities" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "80ms", animationFillMode: "forwards" }}>
            <MyCharities />
          </section>

          <section id="donation-receipts" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "160ms", animationFillMode: "forwards" }}>
            <DonationReceipts />
          </section>

          <section id="quiz-matches" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
            <QuizMatchesSection />
          </section>

          <section id="employer-matching" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "320ms", animationFillMode: "forwards" }}>
            <EmployerMatching />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
