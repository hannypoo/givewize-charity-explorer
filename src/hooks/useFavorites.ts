import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Favorite {
  id: string;
  charity_id: string;
  gift_registry: boolean;
}

function getLocalFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem("givewize-favorites") || "[]");
  } catch {
    return [];
  }
}

function setLocalFavorites(ids: string[]) {
  localStorage.setItem("givewize-favorites", JSON.stringify(ids));
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: dbFavorites = [], isLoading } = useQuery({
    queryKey: ["user-favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_favorites")
        .select("id, charity_id, gift_registry")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []) as Favorite[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // For anonymous users, track localStorage favorites in a query too
  const { data: localFavIds = [] } = useQuery({
    queryKey: ["local-favorites"],
    queryFn: () => getLocalFavorites(),
    enabled: !user,
    staleTime: Infinity,
  });

  const favorites = useMemo(() => {
    if (user) {
      return dbFavorites.map((f) => f.charity_id);
    }
    return localFavIds;
  }, [user, dbFavorites, localFavIds]);

  const isFavorited = useCallback(
    (charityId: string) => favorites.includes(charityId),
    [favorites]
  );

  const toggleMutation = useMutation({
    mutationFn: async (charityId: string) => {
      if (!user) {
        // Anonymous: toggle localStorage
        const current = getLocalFavorites();
        const next = current.includes(charityId)
          ? current.filter((id) => id !== charityId)
          : [...current, charityId];
        setLocalFavorites(next);
        return { added: !current.includes(charityId) };
      }

      const existing = dbFavorites.find((f) => f.charity_id === charityId);
      if (existing) {
        const { error } = await supabase.from("user_favorites").delete().eq("id", existing.id);
        if (error) throw error;
        return { added: false };
      } else {
        const { error } = await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, charity_id: charityId });
        if (error) throw error;
        return { added: true };
      }
    },
    onMutate: async (charityId: string) => {
      // Optimistic update for instant UI feedback
      if (user) {
        await queryClient.cancelQueries({ queryKey: ["user-favorites", user.id] });
        const prev = queryClient.getQueryData<Favorite[]>(["user-favorites", user.id]);
        const existing = prev?.find((f) => f.charity_id === charityId);
        if (existing) {
          queryClient.setQueryData(["user-favorites", user.id], prev?.filter((f) => f.id !== existing.id));
        } else {
          queryClient.setQueryData(["user-favorites", user.id], [
            ...(prev || []),
            { id: `temp-${Date.now()}`, charity_id: charityId, gift_registry: false },
          ]);
        }
        return { prev };
      } else {
        await queryClient.cancelQueries({ queryKey: ["local-favorites"] });
        const prev = queryClient.getQueryData<string[]>(["local-favorites"]);
        const next = prev?.includes(charityId)
          ? prev.filter((id) => id !== charityId)
          : [...(prev || []), charityId];
        queryClient.setQueryData(["local-favorites"], next);
        return { prev };
      }
    },
    onSuccess: (result) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["user-favorites", user.id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["local-favorites"] });
      }
      toast.success(result.added ? "Added to favorites" : "Removed from favorites");
    },
    onError: (_err, _charityId, context) => {
      // Rollback optimistic update
      if (user) {
        queryClient.setQueryData(["user-favorites", user.id], context?.prev);
      } else {
        queryClient.setQueryData(["local-favorites"], context?.prev);
      }
      toast.error("Failed to update favorites");
    },
  });

  const giftRegistryMutation = useMutation({
    mutationFn: async ({ charityId, value }: { charityId: string; value: boolean }) => {
      if (!user) return;
      const existing = dbFavorites.find((f) => f.charity_id === charityId);
      if (!existing) return;
      const { error } = await supabase
        .from("user_favorites")
        .update({ gift_registry: value })
        .eq("id", existing.id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["user-favorites", user.id] });
      }
    },
    onError: () => {
      toast.error("Failed to update gift registry");
    },
  });

  const toggleFavorite = useCallback(
    (charityId: string) => toggleMutation.mutate(charityId),
    [toggleMutation]
  );

  const setGiftRegistry = useCallback(
    (charityId: string, value: boolean) => giftRegistryMutation.mutate({ charityId, value }),
    [giftRegistryMutation]
  );

  const getGiftRegistry = useCallback(
    (charityId: string) => dbFavorites.find((f) => f.charity_id === charityId)?.gift_registry ?? false,
    [dbFavorites]
  );

  return { favorites, isFavorited, toggleFavorite, setGiftRegistry, getGiftRegistry, isLoading };
}
