"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function AddFundsForm({ restricted }: { restricted: boolean }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/ledger/self-credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), description }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setMessage(data.error || "Something went wrong");
      return;
    }

    setStatus("success");
    setMessage("Funds added successfully");
    setAmount("");
    setDescription("");
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-full bg-brand-white border border-brand-gray-line flex items-center justify-center text-brand-navy/70"
          >
            &lt;
          </Link>
          <h1 className="text-xl font-semibold">Add funds</h1>
        </div>

        {restricted ? (
          <div className="card p-6">
            <p className="text-brand-danger font-medium mb-1">Adding funds is restricted</p>
            <p className="text-sm text-brand-navy/60">
              This account is currently restricted from adding funds this
              way. Please use your debit or credit card instead.
            </p>
          </div>
        ) : (
          <>
            {message && (
              <p
                className={`mb-4 text-sm rounded-md px-3 py-2 ${
                  status === "success"
                    ? "text-brand-success bg-brand-success/10"
                    : "text-brand-danger bg-brand-danger/10"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Source (optional)</label>
                <input
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Linked checking account"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
                {status === "loading" ? "Adding..." : "Add funds"}
              </button>
            </form>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}