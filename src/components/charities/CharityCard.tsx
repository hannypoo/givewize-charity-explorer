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
    local: "LOCAL",
    national: "NATIONAL",
    global: "GLOBAL",
  };
  return labels[scope] || scope;
}

export function CharityCard({ charity }: CharityCardProps) {
  return (
    <Link to={`/charities/${charity.id}`}>
      <div className="group h-full bg-card border-3 border-foreground hover:bg-secondary transition-all brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none p-5 relative">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          {/* Logo box */}
          <div className="w-12 h-12 bg-primary border-3 border-foreground flex items-center justify-center">
            {charity.logoUrl ? (
              <img
                src={charity.logoUrl}
                alt={`${charity.name} logo`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Building2 className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          
          {/* Scope tag */}
          <span className="text-xs font-black bg-accent text-accent-foreground border-2 border-foreground px-2 py-0.5 uppercase">
            {getScopeLabel(charity.geographicScope)}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-black text-foreground uppercase line-clamp-1 mb-1">
          {charity.name}
        </h3>

        {/* Category */}
        <span className="text-xs font-bold text-primary uppercase">
          {charity.categoryLabel}
        </span>

        {/* Mission */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-3 font-medium">
          {charity.mission}
        </p>

        {/* Hover link */}
        <div className="mt-4 flex items-center text-xs font-black text-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View →</span>
        </div>
      </div>
    </Link>
  );
}
