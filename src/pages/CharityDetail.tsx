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
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !charity) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Charity not found</h1>
          <p className="mt-2 text-muted-foreground">
            The charity you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-6">
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
      <div className="bg-secondary/30 border-b border-border">
        <div className="container py-4">
          <Link
            to="/charities"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Charities
          </Link>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-start gap-6 mb-10">
          {/* Logo */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border">
            {charity.logo_url ? (
              <img
                src={charity.logo_url}
                alt={`${charity.name} logo`}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <Building2 className="h-12 w-12 text-primary" />
            )}
          </div>

          {/* Name & Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <Badge variant="secondary" className="text-sm">
                {categoryLabels[charity.primary_category] || charity.primary_category}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Globe className="mr-1 h-3 w-3" />
                {scopeLabels[charity.geographic_scope] || charity.geographic_scope}
              </Badge>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {charity.name}
            </h1>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {charity.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={charity.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              )}
              <Button
                variant={isFavorited ? "default" : "outline"}
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className={isFavorited ? "bg-accent hover:bg-accent/90" : ""}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
                />
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </Button>
            </div>
          </div>
        </header>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Founded</p>
                <p className="font-display text-xl font-semibold text-foreground">
                  {charity.year_founded || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Geographic Scope</p>
                <p className="font-display text-xl font-semibold text-foreground">
                  {scopeLabels[charity.geographic_scope] || charity.geographic_scope}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Headquarters</p>
                <p className="font-display text-lg font-semibold text-foreground line-clamp-1">
                  {location || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="mb-10">
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Mission Statement
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {charity.mission_statement || "No mission statement available."}
            </p>
          </CardContent>
        </Card>

        {/* Financial Transparency Section */}
        <Card className="mb-10">
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              Financial Transparency
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Expense Breakdown Chart */}
              <div>
                <h3 className="font-medium text-foreground mb-4">Expense Breakdown</h3>
                {charity.program_expense_percentage !== null ? (
                  <>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Program", value: Number(charity.program_expense_percentage) || 0, color: "hsl(142, 76%, 36%)" },
                              { name: "Admin", value: Number(charity.admin_expense_percentage) || 0, color: "hsl(45, 93%, 47%)" },
                              { name: "Fundraising", value: Number(charity.fundraising_expense_percentage) || 0, color: "hsl(25, 95%, 53%)" },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell fill="hsl(142, 76%, 36%)" />
                            <Cell fill="hsl(45, 93%, 47%)" />
                            <Cell fill="hsl(25, 95%, 53%)" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Percentage Labels */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(142, 76%, 36%)" }} />
                        <span className="text-sm text-muted-foreground">
                          Program: <span className="font-semibold text-foreground">{charity.program_expense_percentage}%</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(45, 93%, 47%)" }} />
                        <span className="text-sm text-muted-foreground">
                          Admin: <span className="font-semibold text-foreground">{charity.admin_expense_percentage ?? "—"}%</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(25, 95%, 53%)" }} />
                        <span className="text-sm text-muted-foreground">
                          Fundraising: <span className="font-semibold text-foreground">{charity.fundraising_expense_percentage ?? "—"}%</span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 rounded-lg bg-muted/30 border border-dashed border-border">
                    <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <PieChart className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">Data pending</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Financial breakdown not yet available</p>
                  </div>
                )}
              </div>

              {/* Transparency Checklist */}
              <div>
                <h3 className="font-medium text-foreground mb-4">Transparency Checklist</h3>
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
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Financial data sourced from IRS Form 990 filings and charity self-reported information. 
                  Last updated based on most recent available fiscal year data. For the most current information, 
                  please visit the organization's official website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs & Services Section */}
        <Card className="mb-10">
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              Programs & Services
            </h2>

            {/* Full Description */}
            <div className="mb-6">
              {charity.full_description ? (
                <p className="text-muted-foreground leading-relaxed">
                  {charity.full_description}
                </p>
              ) : (
                <p className="text-muted-foreground/60 italic">Information being collected</p>
              )}
            </div>

            {/* Programs List */}
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
                <p className="text-muted-foreground/60 italic">Information being collected</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Impact & Outcomes Section */}
        <Card className="mb-10">
          <CardContent className="p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              Impact & Outcomes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Target Population */}
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground">Target Population</h3>
                  </div>
                  {charity.target_population ? (
                    <p className="text-muted-foreground">{charity.target_population}</p>
                  ) : (
                    <p className="text-muted-foreground/60 italic">Information being collected</p>
                  )}
                </CardContent>
              </Card>

              {/* People Served */}
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground">People Served Annually</h3>
                  </div>
                  {charity.people_served_annually ? (
                    <p className="text-2xl font-display font-bold text-foreground">
                      {charity.people_served_annually.toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-muted-foreground/60 italic">Information being collected</p>
                  )}
                </CardContent>
              </Card>

              {/* Measurable Outcomes */}
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground">Measurable Outcomes</h3>
                  </div>
                  <p className="text-muted-foreground/60 italic">Information being collected</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

interface TransparencyItemProps {
  label: string;
  status: boolean | null; // null = pending, true = yes, false = no
  description: string;
  link?: string | null;
}

function TransparencyItem({ label, status, description, link }: TransparencyItemProps) {
  const isPending = status === null;
  const isChecked = status === true;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${isPending ? "bg-muted/30" : "bg-muted/50"}`}>
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isPending
            ? "bg-muted-foreground/10 text-muted-foreground/50"
            : isChecked
            ? "bg-primary/20 text-primary"
            : "bg-muted-foreground/20 text-muted-foreground"
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
          <p className={`font-medium ${isPending ? "text-muted-foreground/70" : isChecked ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
            {isPending && <span className="ml-2 text-xs font-normal text-muted-foreground/50">(Data pending)</span>}
          </p>
          {link && !isPending && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View →
            </a>
          )}
        </div>
        <p className={`text-sm ${isPending ? "text-muted-foreground/50" : "text-muted-foreground"}`}>{description}</p>
      </div>
    </div>
  );
}

export default CharityDetail;
