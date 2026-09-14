import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import RequestForm from "@/components/RequestForm";

export default async function RequestPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("request_restricted")
    .eq("user_id", user!.id)
    .single();

  return <RequestForm restricted={account?.request_restricted ?? false} />;
}