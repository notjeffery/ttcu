import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import BottomNav from "@/components/BottomNav";

export default async function TransactionsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  let entries: {
    id: string;
    entry_type: string;
    amount: number;
    description: string | null;
    created_at: string;
  }[] = [];

  if (account) {
    const { data } = await supabase
      .from("ledger_entries")
      .select("id, entry_type, amount, description, created_at")
      .eq("account_id", account.id)
      .order("created_at", { ascending: false });
    entries = data ?? [];
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-full bg-brand-white border border-brand-gray-line flex items-center justify-center text-brand-navy/70"
          >
            &lt;
          </Link>
          <h1 className="text-xl font-semibold">All transactions</h1>
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
                    year: "numeric",
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
                {e.entry_type === "credit" ? "+" : "-"}${Number(e.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}