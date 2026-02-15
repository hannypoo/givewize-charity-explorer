import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function ReauthDeleteDialog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setVerifying(true);

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password,
    });

    if (signInError) {
      setVerifying(false);
      setError("Incorrect password. Please try again.");
      return;
    }

    setVerifying(false);
    setDeleting(true);

    // Delete account
    const { error: deleteError } = await supabase.rpc("delete_user_account");
    if (deleteError) {
      setDeleting(false);
      toast.error("Failed to delete account. Please try again.");
      return;
    }

    await supabase.auth.signOut();
    toast.success("Your account has been deleted.");
    navigate("/");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  };

  const busy = verifying || deleting;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl">
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all your data, including favorites, donation receipts, quiz results, and employer match requests. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <label htmlFor="reauth-password" className="text-sm font-medium text-foreground">
            Enter your password to confirm
          </label>
          <div className="relative">
            <Input
              id="reauth-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Your password"
              className="pr-10 rounded-xl"
              disabled={busy}
              onKeyDown={(e) => e.key === "Enter" && !busy && handleDelete()}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={busy || !password.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {verifying ? "Verifying..." : deleting ? "Deleting..." : "Yes, delete my account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
