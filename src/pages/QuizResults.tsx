import { Link } from "react-router-dom";
import { ArrowRight, Building2, RefreshCw } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

// Mock matched charities data
const mockMatchedCharities = [
  {
    id: "1",
    name: "National Rare Disease Foundation",
    category: "Rare Diseases",
    matchPercent: 96,
    mission: "Advancing research and providing support for families affected by rare genetic disorders through groundbreaking medical research and community programs.",
    whyMatch: "Matches your interest in rare diseases and preference for established organizations with strong financial transparency.",
  },
  {
    id: "2", 
    name: "Children's Health Initiative",
    category: "Child Welfare",
    matchPercent: 91,
    mission: "Ensuring every child has access to quality healthcare, nutrition, and developmental support regardless of their family's economic situation.",
    whyMatch: "Aligns with your focus on children's causes and preference for organizations with high program spending ratios.",
  },
  {
    id: "3",
    name: "Global Medical Relief Fund",
    category: "Medical & Health",
    matchPercent: 87,
    mission: "Providing emergency medical assistance and long-term healthcare solutions to underserved communities worldwide.",
    whyMatch: "Matches your interest in medical causes and global impact, with excellent transparency scores.",
  },
  {
    id: "4",
    name: "Education for Tomorrow",
    category: "Education",
    matchPercent: 82,
    mission: "Breaking the cycle of poverty through quality education, scholarships, and mentorship programs for at-risk youth.",
    whyMatch: "Aligns with your value for impact metrics and preference for organizations with proven outcomes.",
  },
  {
    id: "5",
    name: "Community Food Network",
    category: "Hunger & Food Security",
    matchPercent: 78,
    mission: "Fighting hunger in local communities through food banks, meal programs, and sustainable food access initiatives.",
    whyMatch: "Matches your interest in local impact and organizations with strong community ratings.",
  },
];

const QuizResults = () => {
  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">
        <div className="container max-w-3xl py-10 md:py-14">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a365d] mb-3">
              Your Top Charity Matches
            </h1>
            <p className="text-lg text-[#6B7280]">
              Based on your quiz responses, here are charities that align with your values.
            </p>
          </div>

          {/* Matched Charity Cards */}
          <div className="space-y-5 mb-10">
            {mockMatchedCharities.map((charity, index) => (
              <div
                key={charity.id}
                className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Logo Placeholder */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F9]">
                    <Building2 className="h-8 w-8 text-[#9CA3AF]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top row: Name + Match Badge */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-[#1a365d]">
                          {charity.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4A90D9]/10 text-[#4A90D9]">
                          {charity.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#22C55E]/10">
                        <span className="text-lg font-bold text-[#22C55E]">
                          {charity.matchPercent}%
                        </span>
                        <span className="text-xs text-[#22C55E] font-medium">match</span>
                      </div>
                    </div>

                    {/* Mission */}
                    <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
                      {charity.mission}
                    </p>

                    {/* Why This Match */}
                    <div className="bg-[#F8FAFC] rounded-lg p-3 mb-4">
                      <p className="text-xs text-[#9CA3AF] uppercase tracking-wide font-medium mb-1">
                        Why this match
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {charity.whyMatch}
                      </p>
                    </div>

                    {/* View Profile Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#4A90D9] text-[#4A90D9] hover:bg-[#4A90D9]/5"
                      asChild
                    >
                      <Link to={`/charities/${charity.id}`}>
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#4A90D9] hover:bg-[#3d7fc4] text-white px-8"
              asChild
            >
              <Link to="/charities">
                Explore All Charities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-[#6B7280] hover:text-[#1F2937] hover:border-gray-400"
              asChild
            >
              <Link to="/quiz/start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizResults;
