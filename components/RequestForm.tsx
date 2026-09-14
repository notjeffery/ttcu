"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function RequestForm({ restricted }: { restricted: boolean }) {
  const [payerAccountNumber, setPayerAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [generated, setGenerated] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGenerated(true);
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
          <h1 className="text-xl font-semibold">Request money</h1>
        </div>

        {restricted ? (
          <div className="card p-6">
            <p className="text-brand-danger font-medium mb-1">Requesting money is restricted</p>
            <p className="text-sm text-brand-navy/60">
              This account is currently restricted from requesting money.
              Please use your debit or credit card instead.
            </p>
          </div>
        ) : (
          <>
            
            {generated ? (
              <div className="card p-6 space-y-3">
                <p className="text-sm text-brand-navy/60">Request summary</p>
                <p className="text-2xl font-semibold">
                  ${parseFloat(amount || "0").toFixed(2)}
                </p>
                <p className="text-sm">
                  From account <span className="font-mono">{payerAccountNumber}</span>
                </p>
                {note && <p className="text-sm text-brand-navy/60">&quot;{note}&quot;</p>}
                <button
                  type="button"
                  onClick={() => setGenerated(false)}
                  className="text-sm text-brand-blue font-medium mt-2"
                >
                  Edit request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payer&apos;s account number
                  </label>
                  <input
                    className="input"
                    value={payerAccountNumber}
                    onChange={(e) => setPayerAccountNumber(e.target.value)}
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
                  <label className="block text-sm font-medium mb-1">Note (optional)</label>
                  <input
                    className="input"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's this for?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Preview request
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}