import { Link } from "react-router-dom";
import { ArrowRight, Building2, RefreshCw } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

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
      <div className="bg-quiz-results min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-24 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 right-[15%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

        <div className="container relative max-w-3xl py-10 md:py-14">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-6">
              <span className="text-sm font-medium text-white/80">Your results</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Your Top Charity Matches
            </h1>
            <p className="text-lg text-white/60">
              Based on your quiz responses, here are charities that align with your values.
            </p>
          </div>

          {/* Matched Charity Cards */}
          <div className="space-y-4 mb-10">
            {mockMatchedCharities.map((charity) => (
              <div
                key={charity.id}
                className="glass-dark rounded-2xl p-5 md:p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-white">
                          {charity.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white/80">
                          {charity.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15">
                        <span className="text-lg font-bold text-orange-light">
                          {charity.matchPercent}%
                        </span>
                        <span className="text-xs text-white/60 font-medium">match</span>
                      </div>
                    </div>

                    <p className="text-sm text-white/50 mb-3 line-clamp-2">
                      {charity.mission}
                    </p>

                    <div className="bg-white/10 rounded-xl p-3 mb-4">
                      <p className="text-xs text-white/40 uppercase tracking-wide font-medium mb-1">
                        Why this match
                      </p>
                      <p className="text-sm text-white/60">{charity.whyMatch}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/25 text-white hover:bg-white/15 rounded-xl"
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
              className="gradient-orange text-accent-foreground font-semibold px-8 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
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
              className="border-white/25 text-white hover:bg-white/15 rounded-2xl"
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
