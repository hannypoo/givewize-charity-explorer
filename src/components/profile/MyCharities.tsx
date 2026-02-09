import { Link } from "react-router-dom";
import { Heart, Building2, Gift, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StarRating } from "@/components/charities/StarRating";
import { getCombinedRating, categoryLabels } from "@/lib/charityUtils";
import type { CharityRow } from "@/hooks/useCharities";

export function MyCharities() {
  const { user } = useAuth();
  const { favorites, toggleFavorite, setGiftRegistry, getGiftRegistry, isLoading: favsLoading } = useFavorites();

  const { data: charities = [], isLoading: charitiesLoading } = useQuery({
    queryKey: ["favorite-charities", favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      const { data } = await supabase
        .from("charities")
        .select("*")
        .in("id", favorites);
      return (data || []) as CharityRow[];
    },
    enabled: favorites.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = favsLoading || charitiesLoading;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">My Charities</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card rounded-xl p-5 shadow-soft animate-pulse">
              <div className="h-10 w-10 rounded-lg bg-muted mb-3" />
              <div className="h-4 w-32 rounded bg-muted mb-2" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-card rounded-xl p-8 shadow-soft text-center">
          <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">You haven't favorited any charities yet.</p>
          <Button className="gradient-orange text-accent-foreground font-semibold rounded-xl" asChild>
            <Link to="/charities">Explore Charities</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {charities.map((charity) => {
            const combined = getCombinedRating(charity);
            return (
              <div key={charity.id} className="bg-card rounded-xl p-5 shadow-soft hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <Link to={`/charities/${charity.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      {charity.logo_url ? (
                        <img src={charity.logo_url} alt="" loading="lazy" className="h-7 w-7 object-contain rounded" />
                      ) : (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm line-clamp-1">{charity.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {categoryLabels[charity.primary_category] || charity.primary_category}
                      </span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => toggleFavorite(charity.id)}
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {combined != null && (
                  <StarRating rating={combined} size="sm" showValue className="mb-2" />
                )}

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {charity.mission_statement}
                </p>

                {user && (
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Gift className="h-3.5 w-3.5" />
                      Gift Registry
                    </div>
                    <Switch
                      checked={getGiftRegistry(charity.id)}
                      onCheckedChange={(checked) => setGiftRegistry(charity.id, checked)}
                      aria-label="Toggle gift registry for this charity"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
