import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountNumber = searchParams.get("accountNumber");
  const routingNumber = searchParams.get("routingNumber");

  if (!accountNumber || !routingNumber) {
    return NextResponse.json({ error: "Missing account or routing number" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("full_name, routing_number")
    .eq("account_number", accountNumber)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (data.routing_number !== routingNumber) {
    return NextResponse.json({ error: "Routing number doesn't match this account" }, { status: 400 });
  }

  // Only expose the name, not the full account record — this endpoint's
  // purpose is confirming "is this the right person," not looking up data.
  return NextResponse.json({ fullName: data.full_name });
}