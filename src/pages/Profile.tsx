import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProfileSectionNav } from "@/components/charities/ProfileSectionNav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileOverview } from "@/components/profile/ProfileOverview";
import { MyCharities } from "@/components/profile/MyCharities";
import { GiftRegistry } from "@/components/profile/GiftRegistry";
import { DonationReceipts } from "@/components/profile/DonationReceipts";
import { QuizMatchesSection } from "@/components/profile/QuizMatchesSection";
import { EmployerMatching } from "@/components/profile/EmployerMatching";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "my-charities", label: "My Charities" },
  { id: "gift-registry", label: "Gift Registry" },
  { id: "donation-receipts", label: "Donation Receipts" },
  { id: "quiz-matches", label: "Quiz & Matches" },
  { id: "employer-matching", label: "Employer Matching" },
];

const sectionIds = SECTIONS.map((s) => s.id);

const Profile = () => {
  usePageTitle("My Profile", "Manage your GiveWiZe profile, favorite charities, donation receipts, quiz results, and employer matching.");
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { activeSection, scrollToSection } = useActiveSection(sectionIds);
  const location = useLocation();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const { error } = await supabase.rpc("delete_user_account");
    if (error) {
      toast.error("Failed to delete account. Please try again.");
      setDeleting(false);
      return;
    }
    await supabase.auth.signOut();
    toast.success("Your account has been deleted.");
    navigate("/");
  };

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
            <Avatar className="h-16 w-16 border-2 border-white/30">
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.display_name || "Avatar"} />
              )}
              <AvatarFallback className="bg-white/20 text-2xl font-bold text-white">
                {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
                {profile?.display_name || "My Profile"}
              </h1>
              <p className="text-white/60 text-sm">{user?.email}</p>
              {profile?.bio && (
                <p className="text-white/50 text-sm mt-1 max-w-md">{profile.bio}</p>
              )}
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

          <section id="gift-registry" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "160ms", animationFillMode: "forwards" }}>
            <GiftRegistry />
          </section>

          <section id="donation-receipts" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
            <DonationReceipts />
          </section>

          <section id="quiz-matches" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "320ms", animationFillMode: "forwards" }}>
            <QuizMatchesSection />
          </section>

          <section id="employer-matching" className="scroll-mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <EmployerMatching />
          </section>

          {/* Delete Account — at the very bottom */}
          <div className="rounded-xl border border-destructive/20 bg-card p-6 shadow-soft animate-fade-in-up opacity-0" style={{ animationDelay: "480ms", animationFillMode: "forwards" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data including favorites, receipts, quiz results, and employer match requests. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl">
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all your data, including favorites, donation receipts, quiz results, and employer match requests. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting ? "Deleting..." : "Yes, delete my account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
