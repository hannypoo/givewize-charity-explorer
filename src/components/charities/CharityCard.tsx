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
      <div className="group h-full bg-card rounded-xl p-5 border border-border transition-all hover:shadow-soft hover:border-primary/30">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
            {charity.logoUrl ? (
              <img
                src={charity.logoUrl}
                alt={`${charity.name} logo`}
                className="h-8 w-8 object-contain rounded"
              />
            ) : (
              <Building2 className="h-5 w-5 text-primary" />
            )}
          </div>
          
          {/* Scope badge */}
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {getScopeLabel(charity.geographicScope)}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
          {charity.name}
        </h3>

        {/* Category */}
        <span className="text-xs text-primary font-medium">
          {charity.categoryLabel}
        </span>

        {/* Mission */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-3">
          {charity.mission}
        </p>

        {/* Hover link */}
        <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View details</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}
