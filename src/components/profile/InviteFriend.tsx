import { useState } from "react";
import { UserPlus, Copy, Share2, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function InviteFriend() {
  const { profile } = useAuth();
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/auth`;
  const canShare = typeof navigator.share === "function";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Join GiveWiZe",
        text: `${profile?.display_name || "Your friend"} thinks you'd love GiveWiZe — discover and support amazing charities!`,
        url: inviteUrl,
      });
    } catch {
      // User cancelled share
    }
  };

  const handleEmailInvite = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const subject = encodeURIComponent("Check out GiveWiZe!");
    const body = encodeURIComponent(
      `Hey! I've been using GiveWiZe to discover amazing charities and I think you'd love it too.\n\nSign up here: ${inviteUrl}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setEmail("");
    toast.success("Opening your email client...");
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Invite a Friend</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Know someone who cares about giving? Share GiveWiZe with them!
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="rounded-xl"
        >
          {copied ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied!" : "Copy Invite Link"}
        </Button>
        {canShare && (
          <Button
            onClick={handleShare}
            className="gradient-orange text-accent-foreground font-semibold rounded-xl glow-orange"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="pl-10 rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleEmailInvite()}
          />
        </div>
        <Button
          onClick={handleEmailInvite}
          variant="outline"
          className="rounded-xl"
        >
          Send Email
        </Button>
      </div>
    </div>
  );
}
