import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

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
      <div className="group h-full bg-card rounded-xl p-5 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1.5 border border-border/50 hover:border-primary/30 ring-1 ring-transparent hover:ring-primary/10">
        {/* Logo placeholder */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary ring-1 ring-border/50 group-hover:ring-primary/20 transition-all">
          {charity.logoUrl ? (
            <img
              src={charity.logoUrl}
              alt={`${charity.name} logo`}
              className="h-12 w-12 object-contain rounded-lg"
            />
          ) : (
            <Building2 className="h-8 w-8 text-muted-foreground/60" />
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {charity.name}
        </h3>

        {/* Category badge */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            {charity.categoryLabel}
          </span>
        </div>

        {/* Geographic scope */}
        <p className="mt-2 text-xs text-muted-foreground">
          {getScopeLabel(charity.geographicScope)}
        </p>

        {/* Mission snippet */}
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {charity.mission}
        </p>
      </div>
    </Link>
  );
}
