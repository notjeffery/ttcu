import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const { recipientAccountNumber, amount, description } = await request.json();

  if (!recipientAccountNumber || !amount || amount <= 0) {
    return NextResponse.json(
      { error: "recipientAccountNumber and a positive amount are required" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: senderAccount } = await admin
    .from("accounts")
    .select("id, account_number, send_restricted")
    .eq("user_id", user.id)
    .single();

  if (!senderAccount) {
    return NextResponse.json({ error: "Sender account not found" }, { status: 404 });
  }

  if (senderAccount.send_restricted) {
    return NextResponse.json(
      { error: "This account is restricted from sending money. Please use your debit/credit card instead." },
      { status: 403 }
    );
  }

  if (senderAccount.account_number === recipientAccountNumber) {
    return NextResponse.json({ error: "Can't send money to your own account" }, { status: 400 });
  }

  const { data: recipientAccount } = await admin
    .from("accounts")
    .select("id")
    .eq("account_number", recipientAccountNumber)
    .single();

  if (!recipientAccount) {
    return NextResponse.json({ error: "Recipient account not found" }, { status: 404 });
  }

  const { data: balanceRow } = await admin
    .from("account_balances")
    .select("balance")
    .eq("account_id", senderAccount.id)
    .maybeSingle();

  const currentBalance = balanceRow?.balance ?? 0;

  if (amount > currentBalance) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  const { error: debitError } = await admin.from("ledger_entries").insert({
    account_id: senderAccount.id,
    entry_type: "debit",
    amount,
    description: description || `Transfer to ${recipientAccountNumber}`,
  });

  if (debitError) {
    return NextResponse.json({ error: debitError.message }, { status: 500 });
  }

  const { error: creditError } = await admin.from("ledger_entries").insert({
    account_id: recipientAccount.id,
    entry_type: "credit",
    amount,
    description: description || `Transfer from ${senderAccount.account_number}`,
  });

  if (creditError) {
    return NextResponse.json({ error: creditError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}