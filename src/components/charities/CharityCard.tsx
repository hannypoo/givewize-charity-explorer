import { Link } from "react-router-dom";
import { Star, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

function truncateMission(mission: string, maxLength: number = 100): string {
  if (mission.length <= maxLength) return mission;
  return mission.substring(0, maxLength).trim() + "...";
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
      <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
        <CardContent className="p-5">
          {/* Logo placeholder */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
            {charity.logoUrl ? (
              <img
                src={charity.logoUrl}
                alt={`${charity.name} logo`}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <Building2 className="h-8 w-8 text-primary" />
            )}
          </div>

          {/* Name */}
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {charity.name}
          </h3>

          {/* Category & Scope badges */}
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {charity.categoryLabel}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <MapPin className="mr-1 h-3 w-3" />
              {getScopeLabel(charity.geographicScope)}
            </Badge>
          </div>

          {/* Mission snippet */}
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {truncateMission(charity.mission)}
          </p>

          {/* Rating */}
          {charity.rating && (
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(charity.rating!)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-medium text-foreground">
                {charity.rating.toFixed(1)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
