import { redirect } from "next/navigation";
import Greeting from "@/components/Greeting";
import BottomNav from "@/components/BottomNav";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ArrowUpRight, ArrowDownLeft, CirclePlus } from "lucide-react";

const quickActions = [
  { label: "Send", icon: ArrowUpRight },
  { label: "Request", icon: ArrowDownLeft },
  { label: "Add funds", icon: CirclePlus },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("id, full_name, account_number, card_last4")
    .eq("user_id", user!.id)
    .single();

  let balance = 0;
  let entries: {
    id: string;
    entry_type: string;
    amount: number;
    description: string | null;
    created_at: string;
  }[] = [];

  if (account) {
    const { data: balanceRow } = await supabase
      .from("account_balances")
      .select("balance")
      .eq("account_id", account.id)
      .maybeSingle();
    balance = balanceRow?.balance ?? 0;

    const { data: ledgerRows } = await supabase
      .from("ledger_entries")
      .select("id, entry_type, amount, description, created_at")
      .eq("account_id", account.id)
      .order("created_at", { ascending: false })
      .limit(10);
    entries = ledgerRows ?? [];
  }

  const displayName = account?.full_name ?? "Customer";
  const cardLast4 = account?.card_last4 ?? "0000";

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue font-semibold">
              {displayName[0]}
            </div>
            <Greeting name={displayName} />
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-white border border-brand-gray-line flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-brand-navy/60" />
          </div>
        </div>

        <p className="text-sm text-brand-navy/60 mb-3">My wallet</p>

        <div className="card p-6 mb-6 bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white">
          <div className="flex items-center justify-between mb-8">
            <span className="font-semibold tracking-tight">Texas Trust Credit Union</span>
            <span className="text-xs uppercase tracking-wide text-white/70">Debit</span>
          </div>
          <p className="text-sm text-white/70 mb-1">Current balance</p>
          <p className="text-3xl font-semibold mb-8">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>•••• •••• •••• {cardLast4}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="card py-4 flex flex-col items-center gap-2 hover:border-brand-blue transition-colors"
            >
              <action.icon className="w-6 h-6 text-brand-blue" strokeWidth={1.75} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <a href="#" className="text-sm text-brand-blue font-medium">
            View all
          </a>
        </div>
        <div className="card divide-y divide-brand-gray-line">
          {entries.length === 0 && (
            <p className="px-5 py-6 text-sm text-brand-navy/50">No transactions yet.</p>
          )}
          {entries.map((e) => (
            <div key={e.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{e.description || "Transaction"}</p>
                <p className="text-sm text-brand-navy/50">
                  {new Date(e.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p
                className={
                  e.entry_type === "credit"
                    ? "text-brand-success font-semibold"
                    : "text-brand-danger font-semibold"
                }
              >
                {e.entry_type === "credit" ? "+" : "-"}${e.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}