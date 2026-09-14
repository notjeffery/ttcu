import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import SendForm from "@/components/SendForm";

export default async function SendPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("send_restricted")
    .eq("user_id", user!.id)
    .single();

  return <SendForm restricted={account?.send_restricted ?? false} />;
}