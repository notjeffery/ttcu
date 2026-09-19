import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import BottomNav from "@/components/BottomNav";

export default async function SendSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; name?: string }>;
}) {
  const { amount, name } = await searchParams;

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

  let balance = 0;
  if (account) {
    const { data: balanceRow } = await supabase
      .from("account_balances")
      .select("balance")
      .eq("account_id", account.id)
      .maybeSingle();
    balance = balanceRow?.balance ?? 0;
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="card p-6 mb-6 bg-brand-success/10 border-brand-success/30">
          <p className="text-brand-success font-semibold mb-1">Sent successfully</p>
          <p className="text-sm text-brand-navy/70">
            {amount && `$${parseFloat(amount).toFixed(2)} `}
            {name && `sent to ${name}.`}
          </p>
        </div>

        <div className="card p-6 mb-8 bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white">
          <p className="text-sm text-white/70 mb-1">Available balance</p>
          <p className="text-3xl font-semibold">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/send" className="btn-primary flex-1 text-center">
            Send again
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 text-center border border-brand-gray-line rounded-md py-2 font-medium"
          >
            Back to home
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}