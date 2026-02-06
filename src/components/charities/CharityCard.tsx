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
      <div className="group h-full glass-card rounded-2xl hover:glass-strong transition-all duration-300 p-5 relative overflow-hidden hover:-translate-y-1">
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        <div className="relative">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center glow-blue">
              {charity.logoUrl ? (
                <img
                  src={charity.logoUrl}
                  alt={`${charity.name} logo`}
                  className="h-8 w-8 object-contain rounded-lg"
                />
              ) : (
                <Building2 className="h-5 w-5 text-primary-foreground" />
              )}
            </div>
            
            <span className="text-xs font-semibold bg-accent/20 text-accent rounded-full px-3 py-1">
              {getScopeLabel(charity.geographicScope)}
            </span>
          </div>

          <h3 className="font-bold text-foreground line-clamp-1 mb-1">
            {charity.name}
          </h3>

          <span className="text-xs font-semibold text-primary">
            {charity.categoryLabel}
          </span>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-3">
            {charity.mission}
          </p>

          <div className="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Learn more →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
