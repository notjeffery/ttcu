"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/LoginLogo";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#12141a] flex flex-col">
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <LoginLogo />
      </div>

      <div className="flex-1 bg-[#26272b] rounded-t-3xl -mt-8 relative z-10 px-6 pt-7 pb-10">
        <div className="flex bg-[#1c1d21] rounded-xl p-1 mb-8">
          <button
            onClick={() => setTab("password")}
            className={
              tab === "password"
                ? "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors bg-[#33353a] text-[#5b9bf5] border border-[#5b9bf5]/50"
                : "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors text-white/70"
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" />
            </svg>
            Password
          </button>
          <button
            onClick={() => setTab("biometric")}
            className={
              tab === "biometric"
                ? "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors bg-black text-white"
                : "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors text-white/70"
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Biometric
          </button>
        </div>

        {tab === "password" ? (
          <form onSubmit={handleSubmit} className="space-y-7">
            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="flex items-center gap-2 text-[#5b9bf5] text-sm mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-[#5b9bf5] text-white pb-2 focus:outline-none placeholder:text-white/30"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="relative">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1c1d21] border-b-2 border-[#3a3b40] rounded-md pl-9 pr-10 py-3 text-white focus:outline-none focus:border-[#5b9bf5] placeholder:text-white/40"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                  aria-label="Toggle password visibility"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-[#5b9bf5] text-[#5b9bf5] rounded-xl py-3 font-medium hover:bg-[#5b9bf5]/10 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-[#5b9bf5]">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-white/70 text-sm max-w-xs">
              Biometric login isn't wired up yet — use Password for now.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <a href="#" className="flex items-center gap-1 text-[#5b9bf5] text-sm underline underline-offset-2">Forgot username/password? &gt;</a>
          <a href="/signup" className="flex items-center gap-1 text-[#5b9bf5] text-base font-bold underline underline-offset-2">Not enrolled? Sign up now! &gt;</a>
        </div>
      </div>
    </div>
  );
}
