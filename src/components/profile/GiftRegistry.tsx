import { Link } from "react-router-dom";
import { Gift, Building2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { categoryLabels } from "@/lib/charityUtils";
import type { CharityRow } from "@/hooks/useCharities";

export function GiftRegistry() {
  const { user } = useAuth();
  const { favorites, getGiftRegistry, setGiftRegistry } = useFavorites();

  const { data: charities = [], isLoading } = useQuery({
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

  const registryCharities = charities.filter((c) => getGiftRegistry(c.id));

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Gift Registry</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Charities you'd love others to donate to on your behalf. Toggle any favorite charity's gift registry in{" "}
        <a href="#my-charities" className="text-primary hover:underline">My Charities</a>.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-card rounded-xl p-5 shadow-soft animate-pulse">
              <div className="h-10 w-10 rounded-lg bg-muted mb-3" />
              <div className="h-4 w-32 rounded bg-muted mb-2" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : registryCharities.length === 0 ? (
        <div className="bg-card rounded-xl p-8 shadow-soft text-center">
          <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-1">Your gift registry is empty.</p>
          <p className="text-sm text-muted-foreground mb-4">
            Toggle the gift registry switch on any of your favorite charities to add them here.
          </p>
          {favorites.length === 0 && (
            <Button className="gradient-orange text-accent-foreground font-semibold rounded-xl" asChild>
              <Link to="/charities">Explore Charities</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {registryCharities.map((charity) => (
            <div key={charity.id} className="bg-card rounded-xl p-5 shadow-soft hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {charity.logo_url ? (
                    <img src={charity.logo_url} alt={`${charity.name} logo`} loading="lazy" className="h-7 w-7 object-contain rounded" />
                  ) : (
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/charities/${charity.id}`} className="font-semibold text-foreground text-sm line-clamp-1 hover:text-primary transition-colors">
                    {charity.name}
                  </Link>
                  <span className="text-xs text-muted-foreground block">
                    {categoryLabels[charity.primary_category] || charity.primary_category}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {charity.mission_statement}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Gift className="h-3.5 w-3.5" />
                  In Registry
                </div>
                <Switch
                  checked={true}
                  onCheckedChange={(checked) => setGiftRegistry(charity.id, checked)}
                  aria-label="Remove from gift registry"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
