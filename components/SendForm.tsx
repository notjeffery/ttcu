"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function SendForm({ restricted }: { restricted: boolean }) {
  const router = useRouter();
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [recipientRoutingNumber, setRecipientRoutingNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientAccountNumber,
        recipientRoutingNumber,
        amount: parseFloat(amount),
        description,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setMessage(data.error || "Something went wrong");
      return;
    }

    const params = new URLSearchParams({
      amount,
      name: data.recipientName || "",
    });
    router.push(`/send/success?${params.toString()}`);
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
          <h1 className="text-xl font-semibold">Send money</h1>
        </div>

        {restricted ? (
          <div className="card p-6">
            <p className="text-brand-danger font-medium mb-1">Sending is restricted</p>
            <p className="text-sm text-brand-navy/60">
              This account is currently restricted from sending money. Please
              use your debit or credit card for purchases and payments instead.
            </p>
          </div>
        ) : (
          <>
            {message && (
              <p className="mb-4 text-sm rounded-md px-3 py-2 text-brand-danger bg-brand-danger/10">
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Recipient account number</label>
                <input
                  className="input"
                  value={recipientAccountNumber}
                  onChange={(e) => setRecipientAccountNumber(e.target.value)}
                  placeholder="Account number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Recipient routing number</label>
                <input
                  className="input"
                  value={recipientRoutingNumber}
                  onChange={(e) => setRecipientRoutingNumber(e.target.value)}
                  placeholder="9-digit routing number"
                  required
                />
              </div>

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
                <label className="block text-sm font-medium mb-1">Note (optional)</label>
                <input
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this for?"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send money"}
              </button>
            </form>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}