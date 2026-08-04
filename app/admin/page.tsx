"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

export default function AdminPage() {
  const [entryType, setEntryType] = useState<"credit" | "debit">("credit");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/ledger/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountNumber,
        amount: parseFloat(amount),
        description,
        reference,
        entryType,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setMessage(data.error || "Something went wrong");
      return;
    }

    setStatus("success");
    setMessage(`${entryType === "credit" ? "Credit" : "Debit"} posted successfully`);
    setAccountNumber("");
    setAmount("");
    setDescription("");
    setReference("");
  }

  return (
    <div className="min-h-screen">
      <header className="bg-brand-navy px-8 py-4 flex items-center justify-between">
        <Logo className="[&_span]:text-white" />
        <span className="text-white/70 text-sm">Admin</span>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold mb-1">Post a manual transaction</h1>
        <p className="text-brand-navy/60 mb-6">
          Adds a credit or debit entry directly to a customer&apos;s ledger.
        </p>

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

        <div className="flex bg-brand-blue-light rounded-lg p-1 mb-4 max-w-xs">
          <button
            type="button"
            onClick={() => setEntryType("credit")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              entryType === "credit" ? "bg-brand-white text-brand-blue shadow-sm" : "text-brand-navy/60"
            }`}
          >
            Credit (add funds)
          </button>
          <button
            type="button"
            onClick={() => setEntryType("debit")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              entryType === "debit" ? "bg-brand-white text-brand-blue shadow-sm" : "text-brand-navy/60"
            }`}
          >
            Debit (remove funds)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Account number</label>
            <input
              className="input"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="10-digit account number"
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
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Grocery purchase, Refund"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reference (optional)</label>
            <input
              className="input"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ticket #, batch ID"
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
            {status === "loading"
              ? "Posting..."
              : `Post ${entryType === "credit" ? "credit" : "debit"}`}
          </button>
        </form>
      </main>
    </div>
  );
}
