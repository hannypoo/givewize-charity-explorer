import { useState } from "react";
import { User, Mail, Calendar, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProfileOverview() {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [saving, setSaving] = useState(false);

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
          </div>
        )}
      </div>
    </div>
  );
}
