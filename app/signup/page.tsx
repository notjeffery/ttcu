"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function generateAccountNumber() {
  // 10-digit random account number — placeholder generation logic,
  // swap for whatever numbering scheme ttcu actually wants.
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message ?? "Signup failed");
      setLoading(false);
      return;
    }

    const { error: accountError } = await supabase.from("accounts").insert({
      user_id: authData.user.id,
      full_name: fullName,
      account_number: generateAccountNumber(),
    });

    if (accountError) {
      setError(accountError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-brand-gray">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-brand-navy mb-2">
          Create your account
        </h1>

        {error && (
          <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}