import { useState } from "react";
import { Receipt, Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type DonationReceipt = Tables<"user_donation_receipts">;

export function DonationReceipts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ charity_name: "", amount: "", donation_date: "", tax_year: "", receipt_note: "" });

  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ["user-receipts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_donation_receipts")
        .select("*")
        .eq("user_id", user.id)
        .order("donation_date", { ascending: false });
      if (error) throw error;
      return data as DonationReceipt[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const payload = {
        user_id: user.id,
        charity_name: form.charity_name,
        amount: parseFloat(form.amount),
        donation_date: form.donation_date || new Date().toISOString().split("T")[0],
        tax_year: form.tax_year ? parseInt(form.tax_year) : new Date().getFullYear(),
        receipt_note: form.receipt_note || null,
      };

      if (editingId) {
        const { error } = await supabase.from("user_donation_receipts").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_donation_receipts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-receipts", user?.id] });
      toast.success(editingId ? "Receipt updated" : "Receipt added");
      resetForm();
    },
    onError: () => toast.error("Failed to save receipt"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_donation_receipts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-receipts", user?.id] });
      toast.success("Receipt deleted");
    },
    onError: () => toast.error("Failed to delete receipt"),
  });

  const resetForm = () => {
    setForm({ charity_name: "", amount: "", donation_date: "", tax_year: "", receipt_note: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (r: DonationReceipt) => {
    setForm({
      charity_name: r.charity_name,
      amount: String(r.amount),
      donation_date: r.donation_date,
      tax_year: String(r.tax_year),
      receipt_note: r.receipt_note || "",
    });
    setEditingId(r.id);
    setShowForm(true);
  };

  // Tax year summary
  const taxSummary = receipts.reduce<Record<number, number>>((acc, r) => {
    acc[r.tax_year] = (acc[r.tax_year] || 0) + Number(r.amount);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Donation Receipts</h2>
        <Button
          size="sm"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="gradient-orange text-accent-foreground font-semibold rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Receipt
        </Button>
      </div>

      {/* Tax Year Summary */}
      {Object.keys(taxSummary).length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(taxSummary)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, total]) => (
              <div key={year} className="bg-card rounded-xl px-4 py-3 shadow-soft">
                <p className="text-xs text-muted-foreground">{year} Total</p>
                <p className="font-display text-lg font-bold text-foreground">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-soft mb-6">
          <h3 className="font-semibold text-foreground mb-4">{editingId ? "Edit Receipt" : "New Receipt"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="r-charity">Charity Name</Label>
              <Input id="r-charity" value={form.charity_name} onChange={(e) => setForm({ ...form, charity_name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="r-amount">Amount ($)</Label>
              <Input id="r-amount" type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="r-date">Donation Date</Label>
              <Input id="r-date" type="date" value={form.donation_date} onChange={(e) => setForm({ ...form, donation_date: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="r-year">Tax Year</Label>
              <Input id="r-year" type="number" value={form.tax_year} onChange={(e) => setForm({ ...form, tax_year: e.target.value })} placeholder={String(new Date().getFullYear())} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="r-note">Note (optional)</Label>
              <Input id="r-note" value={form.receipt_note} onChange={(e) => setForm({ ...form, receipt_note: e.target.value })} className="mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!form.charity_name || !form.amount || saveMutation.isPending}
              className="gradient-orange text-accent-foreground font-semibold rounded-xl"
            >
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Add"}
            </Button>
            <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
          </div>
        </div>
      )}

      {/* Receipts Table */}
      {isLoading ? (
        <div className="bg-card rounded-xl p-6 shadow-soft animate-pulse">
          <div className="h-4 w-48 rounded bg-muted mb-4" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-10 rounded bg-muted" />)}
          </div>
        </div>
      ) : receipts.length === 0 && !showForm ? (
        <div className="bg-card rounded-xl p-8 shadow-soft text-center">
          <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No donation receipts yet. Add your first one to start tracking.</p>
        </div>
      ) : receipts.length > 0 ? (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Charity</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Tax Year</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{r.charity_name}</p>
                      {r.receipt_note && <p className="text-xs text-muted-foreground mt-0.5">{r.receipt_note}</p>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-medium text-foreground">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        {Number(r.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-muted-foreground">{r.donation_date}</td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{r.tax_year}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(r)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(r.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
