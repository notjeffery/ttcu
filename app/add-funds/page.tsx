import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import AddFundsForm from "@/components/AddFundsForm";

export default async function AddFundsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("add_funds_restricted")
    .eq("user_id", user!.id)
    .single();

  return <AddFundsForm restricted={account?.add_funds_restricted ?? false} />;
}