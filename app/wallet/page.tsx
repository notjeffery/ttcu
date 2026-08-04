import { redirect } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import WalletMarkets from "@/components/WalletMarkets";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function WalletPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("id, card_last4")
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

  const cardLast4 = account?.card_last4 ?? "0000";

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
          <h1 className="text-xl font-semibold">Wallet</h1>
        </div>

        <WalletMarkets balance={balance} cardLast4={cardLast4} />
      </div>

      <BottomNav />
    </div>
  );
}