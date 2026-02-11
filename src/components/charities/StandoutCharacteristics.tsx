import { useMemo } from "react";
import {
  TrendingUp, Eye, FileText, Building2,
  Users, Star, Shield, Globe, MapPin, Layers,
  HeartHandshake, Mail, CreditCard, Gift, Sparkles,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { getGivewizeScore } from "@/lib/charityUtils";

type Charity = Tables<"charities">;

interface Characteristic {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface SpecialFeature {
  label: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

function getCharacteristics(charity: Charity): Characteristic[] {
  const chars: Characteristic[] = [];
  const givewizeScore = getGivewizeScore(charity);

  if (charity.program_expense_percentage != null && charity.program_expense_percentage >= 80) {
    chars.push({
      label: "High Program Efficiency",
      description: `${charity.program_expense_percentage}% of expenses go directly to programs and services.`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    });
  }

  if (charity.complete_990_filed && charity.financials_published) {
    chars.push({
      label: "Transparent Finances",
      description: "Complete 990 filed and financials are publicly available.",
      icon: <Eye className="h-5 w-5" />,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    });
  }

  if (charity.annual_report_url) {
    chars.push({
      label: "Annual Report Available",
      description: "This organization publishes an annual report for public review.",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    });
  }

  const age = charity.year_founded ? new Date().getFullYear() - charity.year_founded : 0;
  if (charity.year_founded && age >= 20) {
    chars.push({
      label: "Established Organization",
      description: `Founded in ${charity.year_founded}, serving for ${age} years.`,
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    });
  }

  if (charity.people_served_annually != null && charity.people_served_annually >= 100000) {
    chars.push({
      label: "Large Scale Impact",
      description: `Serves ${charity.people_served_annually.toLocaleString()} people annually.`,
      icon: <Users className="h-5 w-5" />,
      color: "bg-rose-50 text-rose-700 border-rose-200",
    });
  }

  if (charity.community_rating_average != null && Number(charity.community_rating_average) >= 4.0) {
    chars.push({
      label: "Strong Community Rating",
      description: `Rated ${Number(charity.community_rating_average).toFixed(1)}/5 by the community.`,
      icon: <Star className="h-5 w-5" />,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    });
  }

  if (givewizeScore >= 4.0) {
    chars.push({
      label: "High GiveWiZe Score",
      description: `Scored ${givewizeScore.toFixed(1)}/5 on the GiveWiZe algorithm.`,
      icon: <Shield className="h-5 w-5" />,
      color: "bg-sky-50 text-sky-700 border-sky-200",
    });
  }

  if (charity.geographic_scope === "global") {
    chars.push({
      label: "Global Reach",
      description: "This organization operates on an international scale.",
      icon: <Globe className="h-5 w-5" />,
      color: "bg-teal-50 text-teal-700 border-teal-200",
    });
  }

  if (charity.geographic_scope === "local") {
    chars.push({
      label: "Local Focus",
      description: "This organization focuses on local community impact.",
      icon: <MapPin className="h-5 w-5" />,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    });
  }

  if (charity.programs_list && charity.programs_list.length >= 4) {
    chars.push({
      label: "Multiple Programs",
      description: `Operates ${charity.programs_list.length} distinct ${charity.programs_list.length === 1 ? "program" : "programs"} and services.`,
      icon: <Layers className="h-5 w-5" />,
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    });
  }

  return chars;
}

function getSpecialFeatures(charity: Charity): SpecialFeature[] {
  return [
    {
      label: "See Donation Impact",
      description: "Track how your donation is used and see the real-world results of your giving.",
      icon: <HeartHandshake className="h-5 w-5" />,
      available: !!charity.allows_donation_tracking,
    },
    {
      label: "Donor-Recipient Contact",
      description: "Stay in touch with the people and communities your donations support.",
      icon: <Mail className="h-5 w-5" />,
      available: !!charity.allows_donor_recipient_contact,
    },
    {
      label: "Direct Donation",
      description: "Donate directly to this charity without intermediary fees.",
      icon: <CreditCard className="h-5 w-5" />,
      available: charity.accepts_direct_donation !== false,
    },
    {
      label: "Donor Perks",
      description: "Receive updates, thank-you gifts, or exclusive content from this charity.",
      icon: <Gift className="h-5 w-5" />,
      available: !!charity.offers_donor_perks,
    },
  ];
}

interface StandoutCharacteristicsProps {
  charity: Charity;
}

export function StandoutCharacteristics({ charity }: StandoutCharacteristicsProps) {
  const characteristics = useMemo(() => getCharacteristics(charity), [charity]);
  const specialFeatures = useMemo(() => getSpecialFeatures(charity), [charity]);
  const availableFeatures = useMemo(() => specialFeatures.filter((f) => f.available), [specialFeatures]);
  const unavailableFeatures = useMemo(() => specialFeatures.filter((f) => !f.available), [specialFeatures]);

  return (
    <div className="space-y-8">
      {/* Verified Characteristics */}
      {characteristics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characteristics.map((char) => (
            <div
              key={char.label}
              className={`rounded-xl border p-4 transition-all hover:shadow-md ${char.color}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {char.icon}
                <h3 className="font-semibold text-sm">{char.label}</h3>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">{char.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No standout characteristics identified yet.</p>
          <p className="text-sm text-muted-foreground mt-1">We're still gathering data for this charity.</p>
        </div>
      )}

      {/* Special Donor Features */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Donor Experience</h3>
        </div>

        {/* Available features */}
        {availableFeatures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {availableFeatures.map((feature) => (
              <div
                key={feature.label}
                className="rounded-xl border border-primary/30 p-4 bg-primary/5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-primary">{feature.icon}</div>
                  <h4 className="font-semibold text-sm text-foreground">{feature.label}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Unavailable features */}
        {unavailableFeatures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unavailableFeatures.map((feature) => (
              <div
                key={feature.label}
                className="rounded-xl border border-dashed border-border p-4 bg-muted/30 opacity-60"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-muted-foreground">{feature.icon}</div>
                  <h4 className="font-semibold text-sm text-muted-foreground">{feature.label}</h4>
                  <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Not verified</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
