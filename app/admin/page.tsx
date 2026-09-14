"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

type RestrictionStatus = "idle" | "loading" | "loaded" | "saving" | "saved" | "error";

export default function AdminPage() {
  const [entryType, setEntryType] = useState<"credit" | "debit">("credit");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [restrictionAccountNumber, setRestrictionAccountNumber] = useState("");
  const [restrictionAccountName, setRestrictionAccountName] = useState<string | null>(null);
  const [sendRestricted, setSendRestricted] = useState(false);
  const [requestRestricted, setRequestRestricted] = useState(false);
  const [addFundsRestricted, setAddFundsRestricted] = useState(false);
  const [restrictionStatus, setRestrictionStatus] = useState<RestrictionStatus>("idle");
  const [restrictionMessage, setRestrictionMessage] = useState("");

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
        date: date || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setMessage(data.error || "Something went wrong");
      return;
    }

    setStatus("success");
    setMessage(entryType === "credit" ? "Credit posted successfully" : "Debit posted successfully");
    setAccountNumber("");
    setAmount("");
    setDescription("");
    setReference("");
    setDate("");
  }

  async function handleLoadRestrictions() {
    setRestrictionStatus("loading");
    setRestrictionMessage("");
    setRestrictionAccountName(null);

    const res = await fetch(
      "/api/admin/restrictions?accountNumber=" + encodeURIComponent(restrictionAccountNumber)
    );
    const data = await res.json();

    if (!res.ok) {
      setRestrictionStatus("error");
      setRestrictionMessage(data.error || "Account not found");
      return;
    }

    setRestrictionAccountName(data.full_name);
    setSendRestricted(data.send_restricted);
    setRequestRestricted(data.request_restricted);
    setAddFundsRestricted(data.add_funds_restricted);
    setRestrictionStatus("loaded");
  }

  async function handleSaveRestrictions() {
    setRestrictionStatus("saving");
    setRestrictionMessage("");

    const res = await fetch("/api/admin/restrictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountNumber: restrictionAccountNumber,
        sendRestricted,
        requestRestricted,
        addFundsRestricted,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setRestrictionStatus("error");
      setRestrictionMessage(data.error || "Failed to save");
      return;
    }

    setRestrictionStatus("saved");
    setRestrictionMessage("Restrictions updated");
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
            className={
              status === "success"
                ? "mb-4 text-sm rounded-md px-3 py-2 text-brand-success bg-brand-success/10"
                : "mb-4 text-sm rounded-md px-3 py-2 text-brand-danger bg-brand-danger/10"
            }
          >
            {message}
          </p>
        )}

        <div className="flex bg-brand-blue-light rounded-lg p-1 mb-4 max-w-xs">
          <button
            type="button"
            onClick={() => setEntryType("credit")}
            className={
              entryType === "credit"
                ? "flex-1 rounded-md py-2 text-sm font-medium transition-colors bg-brand-white text-brand-blue shadow-sm"
                : "flex-1 rounded-md py-2 text-sm font-medium transition-colors text-brand-navy/60"
            }
          >
            Credit (add funds)
          </button>
          <button
            type="button"
            onClick={() => setEntryType("debit")}
            className={
              entryType === "debit"
                ? "flex-1 rounded-md py-2 text-sm font-medium transition-colors bg-brand-white text-brand-blue shadow-sm"
                : "flex-1 rounded-md py-2 text-sm font-medium transition-colors text-brand-navy/60"
            }
          >
            Debit (remove funds)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4 mb-12">
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
            <label className="block text-sm font-medium mb-1">Date (optional, defaults to today)</label>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
            {status === "loading" ? "Posting..." : entryType === "credit" ? "Post credit" : "Post debit"}
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-1">Account restrictions</h2>
        <p className="text-brand-navy/60 mb-6">
          Restrict a customer from Send, Request, or Add funds. They can
          still use their debit or credit card.
        </p>

        <div className="card p-6 space-y-4">
          <div className="flex gap-2">
            <input
              className="input"
              value={restrictionAccountNumber}
              onChange={(e) => setRestrictionAccountNumber(e.target.value)}
              placeholder="10-digit account number"
            />
            <button
              type="button"
              onClick={handleLoadRestrictions}
              className="btn-primary whitespace-nowrap"
              disabled={restrictionStatus === "loading" || !restrictionAccountNumber}
            >
              {restrictionStatus === "loading" ? "Loading..." : "Load"}
            </button>
          </div>

          {restrictionMessage && (
            <p
              className={
                restrictionStatus === "saved"
                  ? "text-sm rounded-md px-3 py-2 text-brand-success bg-brand-success/10"
                  : "text-sm rounded-md px-3 py-2 text-brand-danger bg-brand-danger/10"
              }
            >
              {restrictionMessage}
            </p>
          )}

          {restrictionAccountName && (
            <>
              <p className="text-sm text-brand-navy/60">
                Account holder: <span className="font-medium text-brand-navy">{restrictionAccountName}</span>
              </p>

              <label className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Restrict Send</span>
                <input
                  type="checkbox"
                  checked={sendRestricted}
                  onChange={(e) => setSendRestricted(e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Restrict Request</span>
                <input
                  type="checkbox"
                  checked={requestRestricted}
                  onChange={(e) => setRequestRestricted(e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Restrict Add funds</span>
                <input
                  type="checkbox"
                  checked={addFundsRestricted}
                  onChange={(e) => setAddFundsRestricted(e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              <button
                type="button"
                onClick={handleSaveRestrictions}
                className="btn-primary w-full"
                disabled={restrictionStatus === "saving"}
              >
                {restrictionStatus === "saving" ? "Saving..." : "Save restrictions"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}