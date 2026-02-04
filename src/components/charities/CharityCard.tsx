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
      <div className="group h-full relative rounded-[1.5rem] transition-all duration-300 hover:-translate-y-2">
        {/* Glass card */}
        <div className="h-full bg-white/70 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)] group-hover:bg-white/80 group-hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] group-hover:border-rose/30 transition-all duration-300">
          {/* Highlight on hover */}
          <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          {/* Top row with logo and rating */}
          <div className="relative flex items-start justify-between mb-4">
            {/* Logo in glass/gradient container */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-plum to-plum-dark ring-2 ring-rose/25 group-hover:ring-rose/50 transition-all shadow-[0_4px_15px_rgba(100,60,120,0.25)]">
              {charity.logoUrl ? (
                <img
                  src={charity.logoUrl}
                  alt={`${charity.name} logo`}
                  className="h-10 w-10 object-contain rounded-lg"
                />
              ) : (
                <Building2 className="h-7 w-7 text-rose" />
              )}
            </div>
            
            {/* Rating in glass pill */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose/15 backdrop-blur-sm text-rose text-xs font-semibold border border-rose/20">
              <Star className="h-3 w-3 fill-rose" />
              <span>A+</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="relative font-bold text-foreground text-lg leading-tight line-clamp-1 group-hover:text-plum transition-colors mb-2">
            {charity.name}
          </h3>

          {/* Category and scope in glass badges */}
          <div className="relative flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/60 backdrop-blur-sm text-secondary-foreground border border-white/50">
              {charity.categoryLabel}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted/60 backdrop-blur-sm text-muted-foreground border border-white/30">
              {getScopeLabel(charity.geographicScope)}
            </span>
          </div>

          {/* Mission snippet */}
          <p className="relative text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {charity.mission}
          </p>

          {/* Hover indicator */}
          <div className="relative mt-4 flex items-center text-xs font-medium text-rose opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Learn more</span>
            <svg className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
