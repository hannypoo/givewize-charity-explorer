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
      <div className="group h-full bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 p-5 relative overflow-hidden">
        {/* Soft hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        
        <div className="relative">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            {/* Logo in soft container */}
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              {charity.logoUrl ? (
                <img
                  src={charity.logoUrl}
                  alt={`${charity.name} logo`}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
            </div>
            
            {/* Scope pill */}
            <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-1">
              {getScopeLabel(charity.geographicScope)}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
            {charity.name}
          </h3>

          {/* Category */}
          <span className="text-xs font-medium text-accent">
            {charity.categoryLabel}
          </span>

          {/* Mission */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-3">
            {charity.mission}
          </p>

          {/* Hover link */}
          <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View details</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
