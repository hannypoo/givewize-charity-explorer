import { useState, useRef } from "react";
import { Mail, Calendar, Pencil, Heart, Receipt, Brain, Camera, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BIO_MAX = 300;

export function ProfileOverview() {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const initials = profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, WebP, or GIF image");
      return;
    }

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setAvatarUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setAvatarUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Add cache-buster so the browser fetches the new image
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    setAvatarUploading(false);

    if (updateError) {
      toast.error("Failed to update profile picture");
    } else {
      toast.success("Profile picture updated");
      await refreshProfile();
    }

    // Reset file input so re-selecting same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_profiles")
      .update({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
      })
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

  const startEditing = () => {
    setIsEditing(true);
    setDisplayName(profile?.display_name || "");
    setBio(profile?.bio || "");
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDisplayName(profile?.display_name || "");
    setBio(profile?.bio || "");
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Overview</h2>
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
        {isEditing ? (
          <div className="space-y-4 max-w-md">
            {/* Avatar upload */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt={profile.display_name || "Avatar"} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Upload profile picture"
                >
                  {avatarUploading ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  aria-label="Choose profile picture"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Click to upload a photo</p>
                <p className="text-xs">JPEG, PNG, WebP or GIF. Max 2MB.</p>
              </div>
            </div>

            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Bio textarea */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= BIO_MAX) setBio(e.target.value);
                }}
                placeholder="Tell us a little about yourself..."
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {bio.length}/{BIO_MAX}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="gradient-orange text-accent-foreground font-semibold rounded-xl">
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={cancelEditing} className="rounded-xl">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt={profile?.display_name || "Avatar"} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
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
                onClick={startEditing}
                className="rounded-xl"
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            </div>

            {/* Bio display */}
            {profile?.bio && (
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            )}

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
