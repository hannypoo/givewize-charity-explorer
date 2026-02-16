import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { getCategoryIcon } from "./CategoryIcon";
import { StarRating } from "./StarRating";
import { supabase } from "@/integrations/supabase/client";
import { getCombinedRating, categoryLabels, scopeLabels, getKeyStandoutBadge } from "@/lib/charityUtils";
import type { CharityRow } from "@/hooks/useCharities";

export interface Charity {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  geographicScope: "local" | "national" | "global";
  mission: string;
  logoUrl?: string;
  /** The full Supabase row for accurate score computation */
  _row: CharityRow;
}

interface CharityCardProps {
  charity: Charity;
}

export function charityRowToCard(row: CharityRow): Charity {
  return {
    id: row.id,
    name: row.name,
    category: row.primary_category,
    categoryLabel: categoryLabels[row.primary_category] || row.primary_category,
    geographicScope: row.geographic_scope,
    mission: row.mission_statement || "",
    logoUrl: row.logo_url || undefined,
    _row: row,
  };
}

export const CharityCard = memo(function CharityCard({ charity }: CharityCardProps) {
  const combinedRating = getCombinedRating(charity._row);
  const badge = getKeyStandoutBadge(charity._row);
  const queryClient = useQueryClient();

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ["charity", charity.id],
      queryFn: async () => {
        const { data } = await supabase
          .from("charities")
          .select("*")
          .eq("id", charity.id)
          .maybeSingle();
        return data as CharityRow | null;
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [charity.id, queryClient]);

  return (
    <Link to={`/charities/${charity.id}`} onMouseEnter={prefetch} onFocus={prefetch}>
      <div className="group h-full rounded-2xl transition-all duration-300 p-5 relative overflow-hidden hover:-translate-y-1 bg-white/15 backdrop-blur-xl border border-white/20 hover:bg-white/25">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
              {charity.logoUrl ? (
                <img
                  src={charity.logoUrl}
                  alt={`${charity.name} logo`}
                  loading="lazy"
                  className="h-10 w-10 object-contain rounded-lg"
                />
              ) : (
                (() => {
                  const Icon = getCategoryIcon(charity.category);
                  return <Icon className="h-6 w-6 text-primary-foreground" />;
                })()
              )}
            </div>

            <span className="text-xs font-semibold text-accent bg-white/80 rounded-full px-3 py-1">
              {scopeLabels[charity.geographicScope] || charity.geographicScope}
            </span>
          </div>

          <h3 className="font-bold text-white line-clamp-1 mb-1" title={charity.name}>
            {charity.name}
          </h3>

          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-block text-xs font-semibold text-accent bg-white/80 rounded-full px-3 py-1">
              {charity.categoryLabel}
            </span>
            {(charity._row.secondary_categories || []).slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="inline-block text-xs font-medium text-white/70 bg-white/15 rounded-full px-2.5 py-0.5"
              >
                {categoryLabels[cat] || cat}
              </span>
            ))}
            {badge && (
              <span className={`inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>

          {combinedRating != null && (
            <div className="mt-2">
              <StarRating rating={combinedRating} size="sm" showValue className="[&_span]:text-white/90 [&_svg]:text-white/30" />
            </div>
          )}

          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed mt-2">
            {charity.mission}
          </p>

          <div className="mt-4 flex items-center text-sm font-semibold text-orange-light/60 group-hover:text-orange-light transition-colors duration-300">
            <span>View profile &rarr;</span>
          </div>
        </div>
      </div>
    </Link>
  );
});
