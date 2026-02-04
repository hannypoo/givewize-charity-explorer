import { Link } from "react-router-dom";
import { Building2, Star } from "lucide-react";

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
      <div className="group h-full bg-card rounded-2xl p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-2 border border-border hover:border-gold/30 ring-1 ring-transparent hover:ring-gold/10">
        {/* Top row with logo and scope */}
        <div className="flex items-start justify-between mb-4">
          {/* Logo with navy background */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-dark ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all shadow-navy">
            {charity.logoUrl ? (
              <img
                src={charity.logoUrl}
                alt={`${charity.name} logo`}
                className="h-10 w-10 object-contain rounded-lg"
              />
            ) : (
              <Building2 className="h-7 w-7 text-gold" />
            )}
          </div>
          
          {/* Rating badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">
            <Star className="h-3 w-3 fill-gold" />
            <span>A+</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-1 group-hover:text-navy transition-colors mb-2">
          {charity.name}
        </h3>

        {/* Category and scope badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {charity.categoryLabel}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {getScopeLabel(charity.geographicScope)}
          </span>
        </div>

        {/* Mission snippet */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {charity.mission}
        </p>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center text-xs font-medium text-gold opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Learn more</span>
          <svg className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
