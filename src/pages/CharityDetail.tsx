import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Heart, ExternalLink, MapPin, Calendar, Globe, Building2,
  ArrowLeft, Loader2, Check, X, Info, Users, Target, TrendingUp, Shield, Share2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ProfileSectionNav } from "@/components/charities/ProfileSectionNav";
import { StandoutCharacteristics } from "@/components/charities/StandoutCharacteristics";
import { CommunityRatingAgent } from "@/components/charities/CommunityRatingAgent";
import { StarRating } from "@/components/charities/StarRating";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCharityById } from "@/hooks/useCharities";
import type { CharityRow } from "@/hooks/useCharities";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getCombinedRating, getCategoryGradient, categoryLabels, scopeLabels, computeGivewizeScores, computeScoreDescriptions } from "@/lib/charityUtils";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "givewize-rating", label: "GiveWiZe Rating" },
  { id: "standout", label: "Standout Characteristics" },
];

const sectionIds = SECTIONS.map((s) => s.id);

const CharityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);
  const { activeSection, scrollToSection } = useActiveSection(sectionIds);

  const { data: charity, isLoading, error } = useCharityById(id);
  usePageTitle(
    charity?.name || "Charity Profile",
    charity
      ? `${charity.name} - ${categoryLabels[charity.primary_category] || charity.primary_category}. View ratings, financial transparency, and impact data on GiveWiZe.`
      : undefined
  );

  // JSON-LD structured data for SEO
  useEffect(() => {
    if (!charity) return;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NGO",
      name: charity.name,
      description: charity.mission_statement || undefined,
      url: charity.website || undefined,
      foundingDate: charity.year_founded ? String(charity.year_founded) : undefined,
      logo: charity.logo_url || undefined,
      areaServed: charity.geographic_scope === "global" ? "Worldwide" : charity.geographic_scope,
      address: charity.city || charity.state ? {
        "@type": "PostalAddress",
        addressLocality: charity.city || undefined,
        addressRegion: charity.state || undefined,
        addressCountry: charity.country || undefined,
      } : undefined,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [charity]);

  const combinedRating = useMemo(
    () => (charity ? getCombinedRating(charity) : null),
    [charity]
  );

  // Related charities (same category, excluding current)
  const { data: relatedCharities = [], isLoading: relatedLoading } = useQuery({
    queryKey: ["related-charities", charity?.primary_category, charity?.id],
    queryFn: async () => {
      if (!charity) return [];
      const { data } = await supabase
        .from("charities")
        .select("id, name, primary_category, logo_url, mission_statement, community_rating_average, score_overall")
        .eq("primary_category", charity.primary_category)
        .neq("id", charity.id)
        .order("community_rating_average", { ascending: false })
        .limit(3);
      return (data || []) as CharityRow[];
    },
    enabled: !!charity,
    staleTime: 5 * 60 * 1000,
  });

  const computedScores = useMemo(
    () => (charity ? computeGivewizeScores(charity) : null),
    [charity]
  );

  const scoreDescriptions = useMemo(
    () => (charity ? computeScoreDescriptions(charity) : null),
    [charity]
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="relative -mt-16 pt-16" style={{ background: 'linear-gradient(135deg, hsl(220, 72%, 50%), hsl(220, 60%, 40%))' }}>
          <div className="container py-8 md:py-12">
            <div className="h-4 w-32 rounded bg-white/20 animate-pulse mb-6" />
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-white/20 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-64 rounded bg-white/20 animate-pulse" />
                <div className="h-4 w-48 rounded bg-white/15 animate-pulse" />
                <div className="h-10 w-40 rounded-xl bg-white/15 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <div className="container py-8 space-y-6">
          <div className="h-6 w-48 rounded bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-6 w-48 rounded bg-muted animate-pulse" />
          <div className="h-48 rounded-xl bg-muted animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (error || !charity) {
    return (
      <Layout>
        <div className="min-h-[60vh] -mt-16 pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220, 72%, 50%) 0%, hsl(220, 60%, 40%) 50%, hsl(220, 50%, 30%) 100%)' }}>
          <div className="container flex flex-col items-center justify-center py-24 text-center">
            <div className="glass-dark rounded-2xl p-8 md:p-12 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white/40" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Charity not found</h1>
              <p className="text-white/60 mb-6">
                The charity you're looking for doesn't exist or has been removed.
              </p>
              <Button
                className="gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link to="/charities">Browse Charities</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const location = [charity.city, charity.state, charity.country].filter(Boolean).join(", ");
  const age = charity.year_founded ? new Date().getFullYear() - charity.year_founded : null;

  return (
    <Layout>
      {/* Hero Banner */}
      <div
        className="relative -mt-16 pt-16"
        style={{ background: getCategoryGradient(charity.primary_category) }}
      >
        <div className="container py-8 md:py-12">
          {/* Back nav */}
          <Link
            to="/charities"
            className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Charities
          </Link>

          <header className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg">
              {charity.logo_url ? (
                <img src={charity.logo_url} alt={`${charity.name} logo`} className="h-14 w-14 object-contain" />
              ) : (
                <Building2 className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                {charity.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                  {categoryLabels[charity.primary_category] || charity.primary_category}
                </span>
                <span className="text-sm text-white/80">
                  {scopeLabels[charity.geographic_scope] || charity.geographic_scope}
                  {location && ` · ${location}`}
                </span>
              </div>

              {/* Combined Rating */}
              {combinedRating != null && (
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={combinedRating} size="lg" showValue className="[&_span]:text-white [&_svg]:text-white/40" />
                  <span className="text-sm text-white/70">
                    Combined Rating
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {charity.website && (
                  <a href={charity.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-white hover:underline">
                    <ExternalLink className="mr-1.5 h-4 w-4" />Visit Website
                  </a>
                )}
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={isFavorited}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isFavorited ? "bg-white text-primary" : "border-2 border-white text-white hover:bg-white/10"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Favorited" : "Favorite"}
                </button>
                <button
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({ title: charity.name, text: charity.mission_statement || "", url: window.location.href });
                      } catch {
                        /* user cancelled share dialog */
                      }
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard");
                    }
                  }}
                  aria-label="Share this charity"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 border-white text-white hover:bg-white/10 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* Sticky Section Nav */}
      <ProfileSectionNav
        sections={SECTIONS}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <div className="bg-secondary min-h-screen">
        <div className="container py-8 md:py-10">
          {/* ── Section A: Overview ───────────────────────────────── */}
          <section id="overview" className="scroll-mt-28 mb-12">
            {/* Mission Statement Card */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Mission Statement</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {charity.mission_statement || "No mission statement available."}
              </p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-xl p-5 shadow-soft">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Year Founded</p>
                {charity.year_founded ? (
                  <>
                    <p className="font-display text-2xl font-bold text-foreground">{charity.year_founded}</p>
                    {age != null && <p className="text-xs text-muted-foreground mt-0.5">{age} years ago</p>}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Still to be Collected</p>
                )}
              </div>
              <div className="bg-card rounded-xl p-5 shadow-soft">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">People Served</p>
                {charity.people_served_annually ? (
                  <p className="font-display text-2xl font-bold text-foreground">
                    {charity.people_served_annually.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Still to be Collected</p>
                )}
              </div>
              <div className="bg-card rounded-xl p-5 shadow-soft">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                {location ? (
                  <p className="font-display text-lg font-bold text-foreground line-clamp-1">{location}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Still to be Collected</p>
                )}
              </div>
            </div>

            {/* Programs & Services */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">Programs & Services</h2>
              <div className="mb-6">
                {charity.full_description ? (
                  <p className="text-muted-foreground leading-relaxed">{charity.full_description}</p>
                ) : (
                  <p className="text-muted-foreground italic">Still to be Collected</p>
                )}
              </div>
              {charity.programs_list && charity.programs_list.length > 0 ? (
                <div>
                  <h3 className="font-medium text-foreground mb-3">Key Programs</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {charity.programs_list.map((program, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">{program}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-foreground mb-3">Key Programs</h3>
                  <p className="text-muted-foreground italic">Still to be Collected</p>
                </div>
              )}
            </div>
          </section>

          {/* ── Section B: GiveWiZe Rating ────────────────────────── */}
          <section id="givewize-rating" className="scroll-mt-28 mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">GiveWiZe Rating</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* GiveWiZe Score Card */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">GiveWiZe Score</h3>
                </div>
                {computedScores ? (
                  <div className="flex flex-col items-center">
                    <div className="relative h-32 w-32 mb-6">
                      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                        <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="12"
                          strokeDasharray={`${(computedScores.overall / 5) * 327} 327`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{computedScores.overall.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">out of 5</span>
                      </div>
                    </div>
                    <div className="w-full space-y-4">
                      <SubScore label="Financial Efficiency" value={computedScores.financial_efficiency} description={scoreDescriptions?.financial_efficiency} />
                      <SubScore label="Transparency" value={computedScores.transparency} description={scoreDescriptions?.transparency} />
                      <SubScore label="Longevity" value={computedScores.longevity} description={scoreDescriptions?.longevity} />
                      <SubScore label="Impact" value={computedScores.impact} description={scoreDescriptions?.impact} />
                    </div>
                    {(() => {
                      const available = [computedScores.financial_efficiency, computedScores.transparency, computedScores.longevity, computedScores.impact].filter(v => v !== null).length;
                      return available < 4 ? (
                        <p className="text-xs text-muted-foreground mt-3 text-center italic">
                          Overall score based on {available} of 4 available data points. Missing data does not penalize the score.
                        </p>
                      ) : null;
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">Rating Pending</span>
                    <p className="text-sm text-muted-foreground mt-2 text-center">We're still gathering data for this charity</p>
                  </div>
                )}
              </div>

              {/* Community Rating Agent */}
              <CommunityRatingAgent
                charity={charity}
                onDonorReviewSubmit={() => {
                  toast.success("Thank you! Your review has been submitted.");
                }}
              />
            </div>

            {/* Financial Transparency */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">Financial Transparency</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Expense Breakdown</h4>
                  {charity.program_expense_percentage !== null ? (
                    <>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Program", value: Number(charity.program_expense_percentage) || 0 },
                                { name: "Admin", value: Number(charity.admin_expense_percentage) || 0 },
                                { name: "Fundraising", value: Number(charity.fundraising_expense_percentage) || 0 },
                              ]}
                              cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value"
                            >
                              <Cell fill="hsl(var(--success))" />
                              <Cell fill="hsl(var(--warning))" />
                              <Cell fill="hsl(var(--error))" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-success" />
                          <span className="text-sm text-muted-foreground">
                            Program: <span className="font-semibold text-foreground">{charity.program_expense_percentage}%</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-warning" />
                          <span className="text-sm text-muted-foreground">
                            Admin: <span className="font-semibold text-foreground">{charity.admin_expense_percentage ?? "—"}%</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-error" />
                          <span className="text-sm text-muted-foreground">
                            Fundraising: <span className="font-semibold text-foreground">{charity.fundraising_expense_percentage ?? "—"}%</span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 rounded-lg bg-secondary border border-dashed border-border">
                      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Globe className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">Still to be Collected</p>
                      <p className="text-sm text-muted-foreground mt-1">Financial breakdown not yet available</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-4">Transparency Checklist</h4>
                  <div className="space-y-3">
                    <TransparencyItem label="Form 990 Filed" status={charity.complete_990_filed} description="Annual tax return filed with the IRS" />
                    <TransparencyItem label="Annual Report Available" status={charity.annual_report_url ? true : charity.annual_report_url === null ? null : false} description="Publicly accessible annual report" link={charity.annual_report_url} />
                    <TransparencyItem label="Financials Published" status={charity.financials_published} description="Financial statements publicly available" />
                    <TransparencyItem label="Independent Audit" status={charity.complete_990_filed === null || charity.financials_published === null ? null : charity.complete_990_filed && charity.financials_published} description="Audited by independent third party" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>Financial data sourced from IRS Form 990 filings and charity self-reported information. Last updated based on most recent available fiscal year data.</p>
                </div>
              </div>
            </div>

            {/* Impact & Outcomes */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">Impact & Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium text-foreground">Target Population</h4>
                  </div>
                  {charity.target_population ? (
                    <p className="text-muted-foreground">{charity.target_population}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Still to be Collected</p>
                  )}
                </div>
                <div className="bg-secondary rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium text-foreground">People Served Annually</h4>
                  </div>
                  {charity.people_served_annually ? (
                    <p className="text-2xl font-display font-bold text-foreground">{charity.people_served_annually.toLocaleString()}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Still to be Collected</p>
                  )}
                </div>
                <div className="bg-secondary rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium text-foreground">Measurable Outcomes</h4>
                  </div>
                  <p className="text-muted-foreground italic">Still to be Collected</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section C: Standout Characteristics ────────────────── */}
          <section id="standout" className="scroll-mt-28 mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Standout Characteristics</h2>
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
              <StandoutCharacteristics charity={charity} />
            </div>
          </section>

          {/* ── Related Charities ─────────────────────────────────── */}
          {(relatedLoading || relatedCharities.length > 0) && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                More in {categoryLabels[charity.primary_category] || charity.primary_category}
              </h2>
              {relatedLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-card rounded-xl p-5 shadow-soft animate-pulse">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-muted" />
                        <div className="h-4 w-32 rounded bg-muted" />
                      </div>
                      <div className="h-3 w-20 rounded bg-muted mb-2" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedCharities.map((related) => {
                  const relCombined = getCombinedRating(related);
                  return (
                    <Link
                      key={related.id}
                      to={`/charities/${related.id}`}
                      className="bg-card rounded-xl p-5 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          {related.logo_url ? (
                            <img src={related.logo_url} alt="" loading="lazy" className="h-7 w-7 object-contain rounded" />
                          ) : (
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                          {related.name}
                        </h3>
                      </div>
                      {relCombined != null && (
                        <StarRating rating={relCombined} size="sm" showValue className="mb-2" />
                      )}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {related.mission_statement}
                      </p>
                    </Link>
                  );
                })}
              </div>
              )}
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

function TransparencyItem({ label, status, description, link }: { label: string; status: boolean | null; description: string; link?: string | null }) {
  const isPending = status === null;
  const isChecked = status === true;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${isPending ? "bg-secondary" : "bg-muted"}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
        isPending ? "bg-muted text-muted-foreground"
          : isChecked ? "bg-primary/20 text-primary"
          : "bg-muted text-muted-foreground"
      }`}>
        {isPending ? <span className="text-xs font-medium">?</span>
          : isChecked ? <Check className="h-4 w-4" />
          : <X className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${isPending ? "text-muted-foreground" : isChecked ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
            {isPending && <span className="ml-2 text-xs font-normal text-amber-600 italic">(Still to be Collected)</span>}
          </p>
          {link && !isPending && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">View &rarr;</a>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SubScore({ label, value, description }: { label: string; value: number | null; description?: string | null }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        {value !== null ? (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(Number(value) / 5) * 100}%` }} />
            </div>
            <span className="text-sm font-medium text-foreground w-8 text-right">{Number(value).toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-xs text-amber-600 italic">Still to be Collected</span>
        )}
      </div>
      {description ? (
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      ) : value === null ? (
        <p className="text-xs text-muted-foreground mt-1 italic">This data point has not been scored yet and does not affect the overall rating.</p>
      ) : null}
    </div>
  );
}

export default CharityDetail;
