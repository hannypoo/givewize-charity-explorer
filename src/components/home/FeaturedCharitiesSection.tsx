import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/charities/StarRating";
import { getCombinedRating, categoryLabels } from "@/lib/charityUtils";
import type { CharityRow } from "@/hooks/useCharities";

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-dark rounded-2xl p-5 animate-pulse">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/15" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/15 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
          <div className="h-4 bg-white/10 rounded w-24 mb-2" />
          <div className="space-y-1.5">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeaturedCharitiesSection() {
  const { data: allCharities = [], isLoading } = useQuery({
    queryKey: ["featured-charities"],
    queryFn: async () => {
      const { data } = await supabase
        .from("charities")
        .select("*")
        .order("community_rating_average", { ascending: false })
        .limit(20);
      return (data || []) as CharityRow[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Pick top 4 by combined rating, rotating categories daily
  const charities = useMemo(() => {
    if (allCharities.length === 0) return [];

    // Group by category (primary + secondary), pick the best from each
    const bestByCategory = new Map<string, CharityRow>();
    for (const c of allCharities) {
      const cats = [c.primary_category, ...(c.secondary_categories || [])];
      for (const cat of cats) {
        const existing = bestByCategory.get(cat);
        if (!existing || (getCombinedRating(c) ?? 0) > (getCombinedRating(existing) ?? 0)) {
          bestByCategory.set(cat, c);
        }
      }
    }

    // Sort categories deterministically, then rotate based on day of year
    const categories = [...bestByCategory.keys()].sort();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const offset = (dayOfYear * 4) % categories.length;

    const picks: CharityRow[] = [];
    const seen = new Set<string>();
    for (let i = 0; picks.length < 4 && i < categories.length; i++) {
      const cat = categories[(offset + i) % categories.length];
      const charity = bestByCategory.get(cat)!;
      if (!seen.has(charity.id)) {
        seen.add(charity.id);
        picks.push(charity);
      }
    }

    // Sort the 4 picks by combined rating descending
    picks.sort((a, b) => (getCombinedRating(b) ?? 0) - (getCombinedRating(a) ?? 0));
    return picks;
  }, [allCharities]);

  if (!isLoading && charities.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-featured">
      <div className="absolute top-0 left-[15%] w-72 h-72 bg-white/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-[20%] w-64 h-64 bg-orange/10 rounded-full blur-[80px]" />

      <div className="container relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 mb-4">
              <Star className="h-3.5 w-3.5 text-orange-light" />
              <span className="text-xs font-semibold text-white/80">Top Rated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Featured charities
            </h2>
          </div>
          <Link
            to="/charities"
            className="group inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            View All
            <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? <FeaturedSkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {charities.map((charity, i) => {
            const combined = getCombinedRating(charity);
            return (
              <Link
                key={charity.id}
                to={`/charities/${charity.id}`}
                className="group glass-dark rounded-2xl p-5 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
                    {charity.logo_url ? (
                      <img
                        src={charity.logo_url}
                        alt={`${charity.name} logo`}
                        loading="lazy"
                        className="h-8 w-8 object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm line-clamp-1" title={charity.name}>
                      {charity.name}
                    </h3>
                    <span className="text-xs text-white/50">
                      {categoryLabels[charity.primary_category] || charity.primary_category}
                    </span>
                  </div>
                </div>

                {combined != null && (
                  <StarRating
                    rating={combined}
                    size="sm"
                    showValue
                    className="[&_span]:text-white/90 [&_svg]:text-white/30 mb-2"
                  />
                )}

                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {charity.mission_statement}
                </p>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
