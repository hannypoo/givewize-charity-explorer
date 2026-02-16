import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type CharityRow = Tables<"charities">;

export interface CharityFilters {
  searchQuery: string;
  selectedCategories: string[];
  selectedScopes: string[];
  minGivewizeScore: number;
  minCommunityRating: number;
  keyFactors: string[];
}

const defaultFilters: CharityFilters = {
  searchQuery: "",
  selectedCategories: [],
  selectedScopes: [],
  minGivewizeScore: 0,
  minCommunityRating: 0,
  keyFactors: [],
};

export function useCharities(filters: CharityFilters = defaultFilters) {
  return useQuery({
    queryKey: ["charities", filters],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      let query = supabase.from("charities").select("*");

      // Search filter
      if (filters.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,mission_statement.ilike.%${filters.searchQuery}%`
        );
      }

      // Category filter — match primary OR any secondary category
      if (filters.selectedCategories.length > 0) {
        query = query.or(
          `primary_category.in.(${filters.selectedCategories.join(",")}),secondary_categories.ov.{${filters.selectedCategories.join(",")}}`
        );
      }

      // Geographic scope filter
      if (filters.selectedScopes.length > 0) {
        query = query.in("geographic_scope", filters.selectedScopes);
      }

      // Note: minGivewizeScore is filtered client-side in Charities.tsx
      // because score_overall is computed on the fly, not stored in DB

      // Minimum community rating
      if (filters.minCommunityRating > 0) {
        query = query.gte("community_rating_average", filters.minCommunityRating);
      }

      // Key factors
      if (filters.keyFactors.includes("high-efficiency")) {
        query = query.gte("program_expense_percentage", 80);
      }
      if (filters.keyFactors.includes("transparent")) {
        query = query.eq("complete_990_filed", true);
        query = query.eq("financials_published", true);
      }
      if (filters.keyFactors.includes("established")) {
        query = query.lte("year_founded", new Date().getFullYear() - 20);
      }
      if (filters.keyFactors.includes("annual-report")) {
        query = query.not("annual_report_url", "is", null);
      }

      query = query.order("name", { ascending: true });

      const { data, error } = await query;
      if (error) throw error;
      return data as CharityRow[];
    },
  });
}

export function useCharityById(id: string | undefined) {
  return useQuery({
    queryKey: ["charity", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charities")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as CharityRow | null;
    },
    enabled: !!id,
  });
}
