import { useState } from "react";
import { User, Mail, Calendar, Pencil, Heart, Receipt, Brain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProfileOverview() {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [saving, setSaving] = useState(false);
  const { favorites } = useFavorites();

  const { data: receiptCount = 0 } = useQuery({
    queryKey: ["receipt-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase.from("user_donation_receipts").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      return count || 0;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const { data: quizCount = 0 } = useQuery({
    queryKey: ["quiz-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase.from("user_quiz_results").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      return count || 0;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  const handleSave = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_profiles")
      .update({ display_name: displayName.trim() })
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
      await refreshProfile();
      setIsEditing(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Overview</h2>
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
        {isEditing ? (
          <div className="space-y-4 max-w-sm">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="gradient-orange text-accent-foreground font-semibold rounded-xl">
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => { setIsEditing(false); setDisplayName(profile?.display_name || ""); }} className="rounded-xl">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">{profile?.display_name || "User"}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {user?.email}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setIsEditing(true); setDisplayName(profile?.display_name || ""); }}
                className="rounded-xl"
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            </div>
            {memberSince && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Member since {memberSince}
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <p className="font-display text-xl font-bold text-foreground">{favorites.length}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Receipt className="h-4 w-4 text-primary" />
                </div>
                <p className="font-display text-xl font-bold text-foreground">{receiptCount}</p>
                <p className="text-xs text-muted-foreground">Receipts</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <p className="font-display text-xl font-bold text-foreground">{quizCount}</p>
                <p className="text-xs text-muted-foreground">Quizzes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
