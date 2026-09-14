import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountNumber = searchParams.get("accountNumber");

  if (!accountNumber) {
    return NextResponse.json({ error: "accountNumber is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("account_number, full_name, send_restricted, request_restricted, add_funds_restricted")
    .eq("account_number", accountNumber)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { accountNumber, sendRestricted, requestRestricted, addFundsRestricted } =
    await request.json();

  if (!accountNumber) {
    return NextResponse.json({ error: "accountNumber is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("accounts")
    .update({
      send_restricted: sendRestricted,
      request_restricted: requestRestricted,
      add_funds_restricted: addFundsRestricted,
    })
    .eq("account_number", accountNumber);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}