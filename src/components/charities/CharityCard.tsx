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
      <div className="group h-full bg-white rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 border border-transparent hover:border-[#4A90D9]/20">
        {/* Logo placeholder */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#F1F5F9]">
          {charity.logoUrl ? (
            <img
              src={charity.logoUrl}
              alt={`${charity.name} logo`}
              className="h-12 w-12 object-contain"
            />
          ) : (
            <Building2 className="h-8 w-8 text-[#9CA3AF]" />
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-[#1a365d] text-lg line-clamp-1">
          {charity.name}
        </h3>

        {/* Category badge */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4A90D9]/10 text-[#4A90D9]">
            {charity.categoryLabel}
          </span>
        </div>

        {/* Geographic scope */}
        <p className="mt-2 text-xs text-[#9CA3AF]">
          {getScopeLabel(charity.geographicScope)}
        </p>

        {/* Mission snippet */}
        <p className="mt-3 text-sm text-[#6B7280] line-clamp-2 leading-relaxed">
          {charity.mission}
        </p>
      </div>
    </Link>
  );
}
