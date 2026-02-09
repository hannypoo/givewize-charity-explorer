import { useState } from "react";
import { Building, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type MatchRequest = Tables<"user_employer_match_requests">;

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
  submitted: { icon: AlertCircle, color: "text-blue-500", label: "Submitted" },
  confirmed: { icon: CheckCircle, color: "text-emerald-500", label: "Confirmed" },
  denied: { icon: XCircle, color: "text-red-500", label: "Denied" },
};

export function EmployerMatching() {
  const { user, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [employerName, setEmployerName] = useState(profile?.employer_name || "");
  const [matchesDonations, setMatchesDonations] = useState(profile?.employer_matches_donations ?? false);
  const [saving, setSaving] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["employer-match-requests", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_employer_match_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MatchRequest[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const saveEmployer = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_profiles")
      .update({
        employer_name: employerName.trim() || null,
        employer_matches_donations: matchesDonations,
      })
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      toast.error("Failed to update employer info");
    } else {
      toast.success("Employer info updated");
      await refreshProfile();
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Employer Matching</h2>

      {/* Employer Settings */}
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft mb-6">
        <h3 className="font-semibold text-foreground mb-4">Employer Information</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="employer">Employer Name</Label>
            <Input
              id="employer"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              placeholder="e.g. Google, Microsoft..."
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Employer Matches Donations</p>
              <p className="text-xs text-muted-foreground">Does your employer offer donation matching?</p>
            </div>
            <Switch checked={matchesDonations} onCheckedChange={setMatchesDonations} />
          </div>
          <Button
            onClick={saveEmployer}
            disabled={saving}
            className="gradient-orange text-accent-foreground font-semibold rounded-xl"
          >
            {saving ? "Saving..." : "Save Employer Info"}
          </Button>
        </div>
      </div>

      {/* Match Requests List */}
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
        <h3 className="font-semibold text-foreground mb-4">Match Requests</h3>
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[0, 1].map((i) => <div key={i} className="h-16 rounded-xl bg-muted" />)}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-6">
            <Building className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No match requests yet. Visit a charity page to request an employer match.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const config = statusConfig[req.status] || statusConfig.pending;
              const Icon = config.icon;
              return (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm">{req.charity_name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${Number(req.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} · {req.employer_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 ${config.color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
