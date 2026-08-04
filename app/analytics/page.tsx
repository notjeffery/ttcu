import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import AnalyticsClient from "@/components/AnalyticsClient";

function monthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short" });
}

export default async function AnalyticsPage() {
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

  type Entry = {
    entry_type: "credit" | "debit";
    amount: number;
    description: string | null;
    created_at: string;
  };

  let entries: Entry[] = [];
  if (account) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data } = await supabase
      .from("ledger_entries")
      .select("entry_type, amount, description, created_at")
      .eq("account_id", account.id)
      .gte("created_at", sixMonthsAgo.toISOString())
      .order("created_at", { ascending: false });

    entries = data ?? [];
  }

  // Monthly spending totals for the last 6 months, oldest to newest
  const now = new Date();
  const months: { key: string; label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: monthLabel(d), value: 0 });
  }
  for (const e of entries) {
    if (e.entry_type !== "debit") continue;
    const d = new Date(e.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const month = months.find((m) => m.key === key);
    if (month) month.value += Number(e.amount);
  }
  const monthlyData = months.map(({ label, value }) => ({ label, value }));

  // Last 30 days stats
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const last30 = entries.filter((e) => new Date(e.created_at) >= thirtyDaysAgo);

  const spending30d = last30
    .filter((e) => e.entry_type === "debit")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const income30d = last30
    .filter((e) => e.entry_type === "credit")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const net30d = income30d - spending30d;

  const stats = [
    { label: "Spending", value: `$${spending30d.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { label: "Income", value: `$${income30d.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { label: "Net", value: `$${net30d.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  ];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  const spendingTransactions = entries
    .filter((e) => e.entry_type === "debit")
    .map((e) => ({
      name: e.description || "Transaction",
      date: formatDate(e.created_at),
      amount: `-$${Number(e.amount).toFixed(2)}`,
    }));

  const incomeTransactions = entries
    .filter((e) => e.entry_type === "credit")
    .map((e) => ({
      name: e.description || "Transaction",
      date: formatDate(e.created_at),
      amount: `+$${Number(e.amount).toFixed(2)}`,
    }));

  return (
    <AnalyticsClient
      monthlyData={monthlyData}
      totalSpending30d={spending30d}
      stats={stats}
      spendingTransactions={spendingTransactions}
      incomeTransactions={incomeTransactions}
    />
  );
}