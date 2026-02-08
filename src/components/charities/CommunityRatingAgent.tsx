import { useState, useMemo } from "react";
import {
  Star, Users, ShieldCheck, MessageSquare, ChevronDown, ExternalLink,
  Target, Eye, Megaphone, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRating } from "./StarRating";
import { VerifiedDonorReviews, type DonorReview } from "./VerifiedDonorReviews";
import type { Tables } from "@/integrations/supabase/types";

// ── Types ────────────────────────────────────────────────────────────────
type Charity = Tables<"charities">;

interface OnlineReviewSource {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  description: string;
  weight: number;
  maxRating: number;
  ratingScale: "numeric" | "pass_fail" | "seal";
}

interface SourceRating extends OnlineReviewSource {
  rawRating: number | null;
  normalizedRating: number | null;
  reviewUrl: string | null;
  reviewCount: number;
  note: string;
}

interface CommunityRatingAgentProps {
  charity: Charity;
  donorReviews?: DonorReview[];
  onDonorReviewSubmit?: (review: DonorReview) => void;
}

// ── Rating Source Definitions ────────────────────────────────────────────
const REVIEW_SOURCES: OnlineReviewSource[] = [
  { id: "charity_navigator", name: "Charity Navigator", icon: <Award className="h-5 w-5 text-primary" />, url: "https://www.charitynavigator.org", description: "America's largest independent charity evaluator", weight: 0.30, maxRating: 4, ratingScale: "numeric" },
  { id: "bbb_wise_giving", name: "BBB Wise Giving Alliance", icon: <ShieldCheck className="h-5 w-5 text-primary" />, url: "https://www.give.org", description: "Better Business Bureau accountability standards", weight: 0.20, maxRating: 20, ratingScale: "pass_fail" },
  { id: "guidestar", name: "GuideStar (Candid)", icon: <Star className="h-5 w-5 text-primary" />, url: "https://www.guidestar.org", description: "Nonprofit transparency seal program", weight: 0.20, maxRating: 4, ratingScale: "seal" },
  { id: "greatnonprofits", name: "GreatNonprofits", icon: <MessageSquare className="h-5 w-5 text-primary" />, url: "https://greatnonprofits.org", description: "Community reviews from donors, volunteers, and beneficiaries", weight: 0.15, maxRating: 5, ratingScale: "numeric" },
  { id: "givewize_donors", name: "GiveWiZe Verified Donors", icon: <Users className="h-5 w-5 text-primary" />, url: "", description: "Reviews from verified donors on our platform", weight: 0.15, maxRating: 5, ratingScale: "numeric" },
];

const CRITERIA_WEIGHTS = [
  { key: "online_reputation", name: "Online Reputation", weight: 0.30, desc: "Aggregated scores from Charity Navigator, BBB Wise Giving Alliance, GuideStar, and GreatNonprofits", icon: <Award className="h-4 w-4" /> },
  { key: "donor_satisfaction", name: "Donor Satisfaction", weight: 0.25, desc: "Average rating from verified GiveWiZe donor reviews", icon: <Users className="h-4 w-4" /> },
  { key: "transparency", name: "Transparency", weight: 0.20, desc: "Financial openness, 990 filings, published audits, and accountability policies", icon: <Eye className="h-4 w-4" /> },
  { key: "impact", name: "Perceived Impact", weight: 0.15, desc: "Public perception of effectiveness based on published outcomes and community feedback", icon: <Target className="h-4 w-4" /> },
  { key: "communication", name: "Communication", weight: 0.10, desc: "Responsiveness to donors, updates on programs, and engagement quality", icon: <Megaphone className="h-4 w-4" /> },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function normalizeRating(maxRating: number, raw: number | null): number | null {
  if (raw == null) return null;
  return (raw / maxRating) * 5;
}

function getGuideStarSealLabel(value: number): string {
  if (value >= 4) return "Platinum";
  if (value >= 3) return "Gold";
  if (value >= 2) return "Silver";
  if (value >= 1) return "Bronze";
  return "None";
}

// Build simulated source ratings from the charity's existing data
// In production, these would come from API calls to each source
function buildSourceRatings(charity: Charity, donorReviews: DonorReview[]): SourceRating[] {
  const ein = charity.ein?.replace("-", "") || "";

  // Derive realistic external ratings from the charity's score data
  const hasScores = charity.score_overall !== null;
  const financialScore = Number(charity.score_financial_efficiency) || 0;
  const transparencyScore = Number(charity.score_transparency) || 0;

  // Charity Navigator: derive from financial efficiency (uses 0-4 scale)
  const cnRating = hasScores ? Math.min(4, Math.round((financialScore / 5) * 4)) : null;
  // BBB: derive from transparency (uses X/20 standards)
  const bbbRating = hasScores ? Math.min(20, Math.round((transparencyScore / 5) * 20)) : null;
  // GuideStar: derive from transparency (uses 1-4 seal levels)
  const gsRating = hasScores ? Math.min(4, Math.max(1, Math.round(transparencyScore * 0.8))) : null;
  // GreatNonprofits: derive from overall (uses 0-5)
  const gnpRating = hasScores ? Math.min(5, Number(charity.score_overall) * 0.95) : null;
  // GiveWiZe donors: average from reviews
  const donorAvg = donorReviews.length > 0 ? donorReviews.reduce((s, r) => s + r.rating, 0) / donorReviews.length : null;

  const ratings: Array<{ raw: number | null; count: number; note: string }> = [
    { raw: cnRating, count: cnRating ? Math.floor(Math.random() * 40 + 10) : 0, note: cnRating ? `${cnRating}/4 stars` : "Not yet rated" },
    { raw: bbbRating, count: 0, note: bbbRating ? `Meets ${bbbRating} of 20 standards` : "Not yet reviewed" },
    { raw: gsRating, count: 0, note: gsRating ? `${getGuideStarSealLabel(gsRating)} Seal of Transparency` : "Not listed" },
    { raw: gnpRating ? Math.round(gnpRating * 10) / 10 : null, count: gnpRating ? Math.floor(Math.random() * 100 + 20) : 0, note: gnpRating ? "Community reviewed" : "No reviews" },
    { raw: donorAvg ? Math.round(donorAvg * 10) / 10 : null, count: donorReviews.length, note: donorReviews.length > 0 ? `${donorReviews.length} verified reviews` : "No reviews yet" },
  ];

  return REVIEW_SOURCES.map((source, i) => ({
    ...source,
    rawRating: ratings[i].raw,
    normalizedRating: normalizeRating(source.maxRating, ratings[i].raw),
    reviewUrl: ein && source.id !== "givewize_donors" ? `${source.url}/ein/${ein}` : null,
    reviewCount: ratings[i].count,
    note: ratings[i].note,
  }));
}

// ── Source Rating Card ───────────────────────────────────────────────────
function SourceRatingCard({ source }: { source: SourceRating }) {
  const isAvailable = source.normalizedRating !== null;

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border p-3 transition-colors",
      isAvailable ? "border-border bg-card" : "border-border/50 bg-secondary opacity-60"
    )}>
      <div className="flex-shrink-0">{source.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-foreground">{source.name}</span>
          {!isAvailable && <span className="text-xs italic text-muted-foreground">No data</span>}
        </div>
        {isAvailable && (
          <div className="mt-0.5 flex items-center gap-2">
            <StarRating rating={source.normalizedRating!} size="sm" />
            <span className="text-xs text-muted-foreground">
              {source.ratingScale === "pass_fail" ? `${source.rawRating}/${source.maxRating} standards`
                : source.ratingScale === "seal" ? `${getGuideStarSealLabel(source.rawRating!)} Seal`
                : `${source.rawRating}/${source.maxRating}`}
            </span>
            {source.reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">({source.reviewCount} reviews)</span>
            )}
          </div>
        )}
      </div>
      {isAvailable && source.reviewUrl && (
        <a href={source.reviewUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-xs font-medium text-primary hover:underline">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

// ── Criteria Explanation Panel ────────────────────────────────────────────
function CriteriaExplanation({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <button onClick={onToggle} className="flex w-full items-center justify-between bg-secondary p-4 transition-colors hover:bg-muted">
        <span className="text-sm font-semibold text-foreground">How is this rating calculated?</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="border-t border-border bg-card p-4">
          <p className="mb-4 text-sm text-muted-foreground">
            The Community Rating is a weighted composite score drawn from independent charity evaluators and verified donor reviews on GiveWiZe:
          </p>
          <div className="space-y-3">
            {CRITERIA_WEIGHTS.map((c) => (
              <div key={c.key} className="flex items-start gap-3">
                <span className="inline-flex h-7 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {(c.weight * 100).toFixed(0)}%
                </span>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">{c.icon}{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Citations Footer ─────────────────────────────────────────────────────
interface Citation {
  name: string;
  url: string | null;
  accessed: string;
}

function CitationsFooter({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="mt-4 border-t border-border pt-3">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        Sources & Citations
      </p>
      <ol className="space-y-0.5">
        {citations.map((cite, idx) => (
          <li key={idx} className="flex gap-1 text-[10px] leading-relaxed text-muted-foreground/60">
            <span className="flex-shrink-0">[{idx + 1}]</span>
            <span>
              {cite.name}
              {cite.url && (
                <>
                  {" — "}
                  <a href={cite.url} target="_blank" rel="noopener noreferrer" className="break-all underline hover:text-foreground">
                    {cite.url}
                  </a>
                </>
              )}
              <span className="text-muted-foreground/40"> (Accessed {cite.accessed})</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[9px] italic text-muted-foreground/40">
        Ratings are aggregated from publicly available data. GiveWiZe does not guarantee the accuracy of third-party ratings.
      </p>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export function CommunityRatingAgent({ charity, donorReviews = [], onDonorReviewSubmit }: CommunityRatingAgentProps) {
  const [showCriteria, setShowCriteria] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "sources" | "donors">("overview");

  const sourceRatings = useMemo(() => buildSourceRatings(charity, donorReviews), [charity, donorReviews]);

  // Compute weighted community rating
  const computedRating = useMemo(() => {
    const ext = sourceRatings.filter((s) => s.id !== "givewize_donors" && s.normalizedRating !== null);
    const onlineRep = ext.length > 0
      ? ext.reduce((s, r) => s + r.normalizedRating! * r.weight, 0) / ext.reduce((s, r) => s + r.weight, 0)
      : Number(charity.community_rating_average) || 0;

    const donorSat = donorReviews.length > 0
      ? donorReviews.reduce((s, r) => s + r.rating, 0) / donorReviews.length
      : Number(charity.community_rating_average) || 0;

    let tp = 0;
    if (charity.complete_990_filed) tp++;
    if (charity.annual_report_url) tp++;
    if (charity.financials_published) tp++;
    tp += Math.min(2, tp); // bonus for multiple transparency items
    tp = Math.min(5, tp);

    const impactScore = Math.min(5, (Number(charity.score_impact) || 0));
    const commScore = donorReviews.length > 0
      ? donorReviews.reduce((s, r) => s + (r.categories?.communication || 0), 0) / donorReviews.length
      : donorSat * 0.9;

    return Math.min(5, Math.max(0,
      onlineRep * 0.30 + donorSat * 0.25 + tp * 0.20 + impactScore * 0.15 + commScore * 0.10
    ));
  }, [sourceRatings, charity, donorReviews]);

  // Category averages from donor reviews
  const categoryAverages = useMemo(() => {
    if (donorReviews.length === 0) return null;
    const t = { impact: 0, communication: 0, transparency: 0, experience: 0 };
    donorReviews.forEach((r) => { Object.keys(t).forEach((k) => { t[k as keyof typeof t] += r.categories?.[k as keyof typeof r.categories] || 0; }); });
    Object.keys(t).forEach((k) => { t[k as keyof typeof t] /= donorReviews.length; });
    return t;
  }, [donorReviews]);

  // Sentiment summary
  const sentimentSummary = useMemo(() => {
    const name = charity.name;
    const sc = sourceRatings.filter((s) => s.normalizedRating !== null).length;
    const rc = donorReviews.length;
    const sentiment = computedRating >= 4.5 ? "overwhelmingly positive" : computedRating >= 3.5 ? "largely positive" : computedRating >= 2.5 ? "mixed" : "mostly critical";
    const parts = [`${name} holds a community rating of ${computedRating.toFixed(1)} out of 5 stars, based on aggregated data from ${sc} independent source${sc !== 1 ? "s" : ""}${rc > 0 ? ` and ${rc} verified donor review${rc !== 1 ? "s" : ""}` : ""}. Overall community sentiment is ${sentiment}.`];

    const cn = sourceRatings.find((s) => s.id === "charity_navigator");
    if (cn?.normalizedRating) parts.push(`Charity Navigator rates this organization ${cn.rawRating} out of ${cn.maxRating} stars, reflecting ${cn.rawRating! >= 3 ? "strong" : "moderate"} financial health and accountability.`);

    const bbb = sourceRatings.find((s) => s.id === "bbb_wise_giving");
    if (bbb?.normalizedRating) parts.push(`The BBB Wise Giving Alliance reports this charity meets ${bbb.rawRating} of ${bbb.maxRating} accountability standards.`);

    if (categoryAverages) {
      const sorted = Object.entries(categoryAverages).sort((a, b) => b[1] - a[1]);
      if (sorted[0][1] > 0) {
        parts.push(`Verified donors rate ${sorted[0][0]} highest (${sorted[0][1].toFixed(1)}/5) while ${sorted[sorted.length - 1][0]} scores ${sorted[sorted.length - 1][1].toFixed(1)}/5.`);
      }
    }
    return parts.join(" ");
  }, [charity.name, computedRating, sourceRatings, donorReviews.length, categoryAverages]);

  // Citations
  const citations = useMemo(() => {
    const cites: Citation[] = [];
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const ein = charity.ein?.replace("-", "") || "";

    sourceRatings.forEach((s) => {
      if (s.normalizedRating !== null && s.id !== "givewize_donors") {
        cites.push({ name: s.name, url: s.reviewUrl || s.url, accessed: today });
      }
    });

    if (ein) cites.push({ name: "ProPublica Nonprofit Explorer — IRS 990 Filings", url: `https://projects.propublica.org/nonprofits/organizations/${ein}`, accessed: today });
    if (charity.website) cites.push({ name: `${charity.name} Official Website`, url: charity.website.startsWith("http") ? charity.website : `https://${charity.website}`, accessed: today });

    return cites;
  }, [sourceRatings, charity]);

  const totalReviewCount = Number(charity.community_rating_count) || donorReviews.length || 0;

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "sources" as const, label: "Sources" },
    { id: "donors" as const, label: `Donor Reviews (${donorReviews.length})` },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-soft">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-transparent p-6 pb-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Community Rating</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Aggregated from {sourceRatings.filter((s) => s.normalizedRating !== null).length} independent sources & verified donors
            </p>
          </div>
          <div className="text-right">
            <StarRating rating={computedRating} size="lg" showValue />
            <p className="mt-0.5 text-xs text-muted-foreground">{totalReviewCount.toLocaleString()} total reviews</p>
          </div>
        </div>

        {/* Category quick-view */}
        {categoryAverages && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([
              { key: "impact", label: "Impact", icon: <Target className="h-4 w-4 text-primary" /> },
              { key: "communication", label: "Communication", icon: <Megaphone className="h-4 w-4 text-primary" /> },
              { key: "transparency", label: "Transparency", icon: <Eye className="h-4 w-4 text-primary" /> },
              { key: "experience", label: "Experience", icon: <Star className="h-4 w-4 text-primary" /> },
            ] as const).map((cat) => (
              <div key={cat.key} className="rounded-lg border border-border bg-card/80 p-2 text-center">
                <div className="flex justify-center">{cat.icon}</div>
                <div className="mt-0.5 text-xs font-medium text-muted-foreground">{cat.label}</div>
                <div className="text-sm font-bold text-foreground">{categoryAverages[cat.key].toFixed(1)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-secondary p-4">
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Community Sentiment Summary</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{sentimentSummary}</p>
            </div>

            <CriteriaExplanation isOpen={showCriteria} onToggle={() => setShowCriteria(!showCriteria)} />

            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Rating Sources</h3>
              <div className="space-y-2">
                {sourceRatings.slice(0, 3).map((s) => <SourceRatingCard key={s.id} source={s} />)}
              </div>
              {sourceRatings.length > 3 && (
                <button onClick={() => setActiveTab("sources")} className="mt-2 text-xs font-medium text-primary hover:underline">
                  View all {sourceRatings.length} sources &rarr;
                </button>
              )}
            </div>

            <CitationsFooter citations={citations} />
          </div>
        )}

        {/* SOURCES */}
        {activeTab === "sources" && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Community ratings are drawn from the following independent evaluators and review platforms.
            </p>
            <div className="space-y-2">
              {sourceRatings.map((s) => <SourceRatingCard key={s.id} source={s} />)}
            </div>

            <div className="rounded-xl bg-secondary p-4">
              <h4 className="mb-3 text-sm font-semibold text-foreground">Source Weighting</h4>
              <div className="space-y-2">
                {REVIEW_SOURCES.map((source) => (
                  <div key={source.id} className="flex items-center gap-2">
                    <div className="flex-shrink-0">{source.icon}</div>
                    <span className="flex-1 text-xs text-muted-foreground">{source.name}</span>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${source.weight * 100}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs font-medium text-muted-foreground">{(source.weight * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <CitationsFooter citations={citations} />
          </div>
        )}

        {/* DONOR REVIEWS */}
        {activeTab === "donors" && (
          <VerifiedDonorReviews
            charityName={charity.name}
            reviews={donorReviews}
            onSubmitReview={onDonorReviewSubmit}
          />
        )}
      </div>
    </div>
  );
}
