import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const { amount, description } = await request.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "A positive amount is required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: account } = await admin
    .from("accounts")
    .select("id, add_funds_restricted")
    .eq("user_id", user.id)
    .single();

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (account.add_funds_restricted) {
    return NextResponse.json(
      { error: "This account is restricted from adding funds. Please use your debit/credit card instead." },
      { status: 403 }
    );
  }

  const { error } = await admin.from("ledger_entries").insert({
    account_id: account.id,
    entry_type: "credit",
    amount,
    description: description || "Added funds",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}