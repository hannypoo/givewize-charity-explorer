import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Heart, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Globe, 
  Building2,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Info,
  Users,
  Target,
  TrendingUp,
  Star,
  Shield
} from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const categoryLabels: Record<string, string> = {
  "rare-diseases": "Rare Diseases",
  "medical-health": "Medical & Health",
  "education": "Education",
  "hunger-food-security": "Hunger & Food Security",
  "animal-welfare": "Animal Welfare",
  "child-welfare": "Child Welfare",
  "environment-climate": "Environment & Climate",
  "emergency-relief": "Emergency Relief",
  "housing-homelessness": "Housing & Homelessness",
  "mental-health": "Mental Health",
  "veterans": "Veterans",
  "arts-culture": "Arts & Culture",
  "human-rights": "Human Rights",
  "disability-services": "Disability Services",
  "senior-services": "Senior Services",
  "community-development": "Community Development",
  "faith-based": "Faith-Based",
  "international-development": "International Development",
};

const scopeLabels: Record<string, string> = {
  local: "Local",
  national: "National",
  global: "Global",
};

const CharityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);

  const { data: charity, isLoading, error } = useQuery({
    queryKey: ["charity", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charities")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#4A90D9]" />
        </div>
      </Layout>
    );
  }

  if (error || !charity) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-[#1a365d]">Charity not found</h1>
          <p className="mt-2 text-[#6B7280]">
            The charity you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-6 bg-[#4A90D9] hover:bg-[#3d7fc4]">
            <Link to="/charities">Browse Charities</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const location = [charity.city, charity.state, charity.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Layout>
      {/* Back navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-4">
          <Link
            to="/charities"
            className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#4A90D9] transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Charities
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-8 md:py-10">
          <header className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5F9]">
              {charity.logo_url ? (
                <img
                  src={charity.logo_url}
                  alt={`${charity.name} logo`}
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <Building2 className="h-12 w-12 text-[#9CA3AF]" />
              )}
            </div>

            {/* Name & Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a365d] mb-3">
                {charity.name}
              </h1>

              {/* Category badge & scope */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#4A90D9]/10 text-[#4A90D9]">
                  {categoryLabels[charity.primary_category] || charity.primary_category}
                </span>
                <span className="text-sm text-[#9CA3AF]">
                  {scopeLabels[charity.geographic_scope] || charity.geographic_scope}
                  {location && ` · ${location}`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                {charity.website && (
                  <a 
                    href={charity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-[#4A90D9] hover:underline"
                  >
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    Visit Website
                  </a>
                )}
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isFavorited 
                      ? "bg-[#4A90D9] text-white" 
                      : "border-2 border-[#4A90D9] text-[#4A90D9] hover:bg-[#4A90D9]/5"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Favorited" : "Favorite"}
                </button>
              </div>
            </div>
          </header>
        </div>
      </div>

      <div className="bg-[#F8FAFC] min-h-screen">
        <div className="container py-8 md:py-10">
          {/* Mission Statement Card */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="font-display text-xl font-semibold text-[#1a365d] mb-4">
              Mission Statement
            </h2>
            <p className="text-[#6B7280] leading-relaxed text-lg">
              {charity.mission_statement || "No mission statement available."}
            </p>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A90D9]/10">
                  <Calendar className="h-5 w-5 text-[#4A90D9]" />
                </div>
              </div>
              <p className="text-sm text-[#9CA3AF] mb-1">Year Founded</p>
              <p className="font-display text-2xl font-bold text-[#1a365d]">
                {charity.year_founded || "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A90D9]/10">
                  <Users className="h-5 w-5 text-[#4A90D9]" />
                </div>
              </div>
              <p className="text-sm text-[#9CA3AF] mb-1">People Served</p>
              <p className="font-display text-2xl font-bold text-[#1a365d]">
                {charity.people_served_annually 
                  ? charity.people_served_annually.toLocaleString()
                  : "N/A"
                }
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A90D9]/10">
                  <MapPin className="h-5 w-5 text-[#4A90D9]" />
                </div>
              </div>
              <p className="text-sm text-[#9CA3AF] mb-1">Location</p>
              <p className="font-display text-lg font-bold text-[#1a365d] line-clamp-1">
                {location || "N/A"}
              </p>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* GiveWiZe Score Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-[#4A90D9]" />
                <h2 className="font-display text-lg font-semibold text-[#1a365d]">
                  GiveWiZe Score
                </h2>
              </div>

              {charity.score_overall !== null ? (
                <div className="flex flex-col items-center">
                  {/* Circular Progress */}
                  <div className="relative h-32 w-32 mb-6">
                    <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#4A90D9"
                        strokeWidth="12"
                        strokeDasharray={`${(Number(charity.score_overall) / 5) * 327} 327`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-[#1a365d]">
                        {Number(charity.score_overall).toFixed(1)}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">out of 5</span>
                    </div>
                  </div>

                  {/* Sub-scores */}
                  <div className="w-full space-y-3">
                    <SubScore label="Financial Efficiency" value={charity.score_financial_efficiency} />
                    <SubScore label="Transparency" value={charity.score_transparency} />
                    <SubScore label="Longevity" value={charity.score_longevity} />
                    <SubScore label="Impact" value={charity.score_impact} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] text-[#9CA3AF]">
                    Rating Pending
                  </span>
                  <p className="text-sm text-[#9CA3AF] mt-2 text-center">
                    We're still gathering data for this charity
                  </p>
                </div>
              )}
            </div>

            {/* Community Rating Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-[#4A90D9]" />
                <h2 className="font-display text-lg font-semibold text-[#1a365d]">
                  Community Rating
                </h2>
              </div>

              {charity.community_rating_average !== null ? (
                <div className="flex flex-col items-center py-4">
                  {/* Star Display */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 ${
                          star <= Math.round(Number(charity.community_rating_average))
                            ? "fill-[#FBBF24] text-[#FBBF24]"
                            : "text-[#E5E7EB]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-3xl font-bold text-[#1a365d] mb-1">
                    {Number(charity.community_rating_average).toFixed(1)}
                  </p>
                  <p className="text-sm text-[#9CA3AF]">
                    Based on {charity.community_rating_count || 0} reviews
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] text-[#9CA3AF]">
                    Rating Pending
                  </span>
                  <p className="text-sm text-[#9CA3AF] mt-2 text-center">
                    No community reviews yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Transparency Section */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="font-display text-xl font-semibold text-[#1a365d] mb-6">
              Financial Transparency
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Expense Breakdown Chart */}
              <div>
                <h3 className="font-medium text-[#1F2937] mb-4">Expense Breakdown</h3>
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
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell fill="#22C55E" />
                            <Cell fill="#F59E0B" />
                            <Cell fill="#EF4444" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Percentage Labels */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#22C55E]" />
                        <span className="text-sm text-[#6B7280]">
                          Program: <span className="font-semibold text-[#1F2937]">{charity.program_expense_percentage}%</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                        <span className="text-sm text-[#6B7280]">
                          Admin: <span className="font-semibold text-[#1F2937]">{charity.admin_expense_percentage ?? "—"}%</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
                        <span className="text-sm text-[#6B7280]">
                          Fundraising: <span className="font-semibold text-[#1F2937]">{charity.fundraising_expense_percentage ?? "—"}%</span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 rounded-lg bg-[#F8FAFC] border border-dashed border-gray-200">
                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Globe className="h-10 w-10 text-[#9CA3AF]" />
                    </div>
                    <p className="text-[#6B7280] font-medium">Data pending</p>
                    <p className="text-sm text-[#9CA3AF] mt-1">Financial breakdown not yet available</p>
                  </div>
                )}
              </div>

              {/* Transparency Checklist */}
              <div>
                <h3 className="font-medium text-[#1F2937] mb-4">Transparency Checklist</h3>
                <div className="space-y-3">
                  <TransparencyItem
                    label="Form 990 Filed"
                    status={charity.complete_990_filed}
                    description="Annual tax return filed with the IRS"
                  />
                  <TransparencyItem
                    label="Annual Report Available"
                    status={charity.annual_report_url ? true : charity.annual_report_url === null ? null : false}
                    description="Publicly accessible annual report"
                    link={charity.annual_report_url}
                  />
                  <TransparencyItem
                    label="Financials Published"
                    status={charity.financials_published}
                    description="Financial statements publicly available"
                  />
                  <TransparencyItem
                    label="Independent Audit"
                    status={
                      charity.complete_990_filed === null || charity.financials_published === null
                        ? null
                        : charity.complete_990_filed && charity.financials_published
                    }
                    description="Audited by independent third party"
                  />
                </div>
              </div>
            </div>

            {/* Data Source Note */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-2 text-sm text-[#6B7280]">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Financial data sourced from IRS Form 990 filings and charity self-reported information. 
                  Last updated based on most recent available fiscal year data.
                </p>
              </div>
            </div>
          </div>

          {/* Programs & Services Section */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="font-display text-xl font-semibold text-[#1a365d] mb-6">
              Programs & Services
            </h2>

            {/* Full Description */}
            <div className="mb-6">
              {charity.full_description ? (
                <p className="text-[#6B7280] leading-relaxed">
                  {charity.full_description}
                </p>
              ) : (
                <p className="text-[#9CA3AF] italic">Information being collected</p>
              )}
            </div>

            {/* Programs List */}
            {charity.programs_list && charity.programs_list.length > 0 ? (
              <div>
                <h3 className="font-medium text-[#1F2937] mb-3">Key Programs</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {charity.programs_list.map((program, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#4A90D9] mt-2 shrink-0" />
                      <span className="text-[#6B7280]">{program}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="font-medium text-[#1F2937] mb-3">Key Programs</h3>
                <p className="text-[#9CA3AF] italic">Information being collected</p>
              </div>
            )}
          </div>

          {/* Impact & Outcomes Section */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-[#1a365d] mb-6">
              Impact & Outcomes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Target Population */}
              <div className="bg-[#F8FAFC] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A90D9]/10">
                    <Target className="h-5 w-5 text-[#4A90D9]" />
                  </div>
                  <h3 className="font-medium text-[#1F2937]">Target Population</h3>
                </div>
                {charity.target_population ? (
                  <p className="text-[#6B7280]">{charity.target_population}</p>
                ) : (
                  <p className="text-[#9CA3AF] italic">Information being collected</p>
                )}
              </div>

              {/* People Served */}
              <div className="bg-[#F8FAFC] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A90D9]/10">
                    <Users className="h-5 w-5 text-[#4A90D9]" />
                  </div>
                  <h3 className="font-medium text-[#1F2937]">People Served Annually</h3>
                </div>
                {charity.people_served_annually ? (
                  <p className="text-2xl font-display font-bold text-[#1a365d]">
                    {charity.people_served_annually.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-[#9CA3AF] italic">Information being collected</p>
                )}
              </div>

              {/* Measurable Outcomes */}
              <div className="bg-[#F8FAFC] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A90D9]/10">
                    <TrendingUp className="h-5 w-5 text-[#4A90D9]" />
                  </div>
                  <h3 className="font-medium text-[#1F2937]">Measurable Outcomes</h3>
                </div>
                <p className="text-[#9CA3AF] italic">Information being collected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface TransparencyItemProps {
  label: string;
  status: boolean | null;
  description: string;
  link?: string | null;
}

function TransparencyItem({ label, status, description, link }: TransparencyItemProps) {
  const isPending = status === null;
  const isChecked = status === true;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${isPending ? "bg-[#F8FAFC]" : "bg-[#F1F5F9]"}`}>
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isPending
            ? "bg-gray-200 text-[#9CA3AF]"
            : isChecked
            ? "bg-[#4A90D9]/20 text-[#4A90D9]"
            : "bg-gray-200 text-[#6B7280]"
        }`}
      >
        {isPending ? (
          <span className="text-xs font-medium">?</span>
        ) : isChecked ? (
          <Check className="h-4 w-4" />
        ) : (
          <X className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${isPending ? "text-[#9CA3AF]" : isChecked ? "text-[#1F2937]" : "text-[#6B7280]"}`}>
            {label}
            {isPending && <span className="ml-2 text-xs font-normal text-[#9CA3AF]">(Data pending)</span>}
          </p>
          {link && !isPending && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A90D9] hover:underline text-sm"
            >
              View →
            </a>
          )}
        </div>
        <p className={`text-sm ${isPending ? "text-[#9CA3AF]" : "text-[#6B7280]"}`}>{description}</p>
      </div>
    </div>
  );
}

interface SubScoreProps {
  label: string;
  value: number | null;
}

function SubScore({ label, value }: SubScoreProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#6B7280]">{label}</span>
      {value !== null ? (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4A90D9] rounded-full"
              style={{ width: `${(Number(value) / 5) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[#1F2937] w-8 text-right">
            {Number(value).toFixed(1)}
          </span>
        </div>
      ) : (
        <span className="text-xs text-[#9CA3AF] italic">Pending</span>
      )}
    </div>
  );
}

export default CharityDetail;
