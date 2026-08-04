import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { accountNumber, amount, description, reference, entryType } = body;

  if (!accountNumber || !amount || !entryType) {
    return NextResponse.json(
      { error: "accountNumber, amount, and entryType are required" },
      { status: 400 }
    );
  }

  if (entryType !== "credit" && entryType !== "debit") {
    return NextResponse.json(
      { error: "entryType must be 'credit' or 'debit'" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("id")
    .eq("account_number", accountNumber)
    .single();

  if (accountError || !account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (entryType === "debit") {
    const { data: balanceRow } = await supabase
      .from("account_balances")
      .select("balance")
      .eq("account_id", account.id)
      .maybeSingle();

    const currentBalance = balanceRow?.balance ?? 0;
    if (amount > currentBalance) {
      return NextResponse.json(
        { error: "Debit exceeds available balance" },
        { status: 400 }
      );
    }
  }

  const { error: insertError } = await supabase.from("ledger_entries").insert({
    account_id: account.id,
    entry_type: entryType,
    amount,
    description: description || (entryType === "credit" ? "Manual credit" : "Manual debit"),
    reference: reference || null,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
