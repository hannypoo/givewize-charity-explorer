import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";

export interface Charity {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  geographicScope: "local" | "national" | "global";
  mission: string;
  rating?: number;
  logoUrl?: string;
}

interface CharityCardProps {
  charity: Charity;
}

function getScopeLabel(scope: string): string {
  const labels: Record<string, string> = {
    local: "Local",
    national: "National",
    global: "Global",
  };
  return labels[scope] || scope;
}

export function CharityCard({ charity }: CharityCardProps) {
  return (
    <Link to={`/charities/${charity.id}`}>
      <div className="group h-full bg-card border-2 border-border hover:border-primary transition-all p-5 relative">
        {/* Corner accent on hover */}
        <div className="absolute top-0 right-0 w-0 h-0 bg-coral transition-all group-hover:w-4 group-hover:h-4" />
        
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          {/* Logo in geometric box */}
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
            {charity.logoUrl ? (
              <img
                src={charity.logoUrl}
                alt={`${charity.name} logo`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Building2 className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
            )}
          </div>
          
          {/* Scope */}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {getScopeLabel(charity.geographicScope)}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
          {charity.name}
        </h3>

        {/* Category */}
        <span className="text-xs font-semibold text-coral">
          {charity.categoryLabel}
        </span>

        {/* Mission */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-3">
          {charity.mission}
        </p>

        {/* Hover link */}
        <div className="mt-4 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>VIEW DETAILS</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}
