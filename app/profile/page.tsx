import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("full_name, account_number, routing_number, created_at")
    .eq("user_id", user!.id)
    .single();

  const customer = {
    name: account?.full_name ?? "Customer",
    memberSinceYear: account?.created_at
      ? new Date(account.created_at).getFullYear()
      : new Date().getFullYear(),
    email: user!.email ?? "Not set",
    phone: null,
    accountNumber: account?.account_number ?? "0000000000",
    routingNumber: account?.routing_number ?? "000000000",
  };

  return <ProfileClient customer={customer} />;
}
