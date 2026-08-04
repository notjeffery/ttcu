"use client";

import { useEffect, useState } from "react";
import { Snowflake, CreditCard, MoreHorizontal } from "lucide-react";

const cardActions = [
  { label: "Freeze card", icon: Snowflake },
  { label: "Card details", icon: CreditCard },
  { label: "More", icon: MoreHorizontal },
];

const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
];

type CryptoRow = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};

const REFRESH_MS = 30_000;

export default function WalletMarkets({
  balance,
  cardLast4,
}: {
  balance: number;
  cardLast4: string;
}) {
  const [crypto, setCrypto] = useState<CryptoRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      try {
        const ids = COINS.map((c) => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        const rows: CryptoRow[] = COINS.map((c) => ({
          symbol: c.symbol,
          name: c.name,
          price: data[c.id]?.usd ?? 0,
          change: data[c.id]?.usd_24h_change ?? 0,
        }));

        setCrypto(rows);
        setStatus("ready");
      } catch (err) {
        if (!cancelled) setStatus("error");
        console.error("Failed to fetch crypto prices:", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="card p-6 mb-6 bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white">
        <div className="flex items-center justify-between mb-10">
          <span className="text-sm text-white/70">Debit card</span>
          <span className="font-semibold tracking-wide">VISA</span>
        </div>
        <p className="text-lg tracking-widest mb-8">
          •••• •••• •••• {cardLast4}
        </p>
        <p className="text-sm text-white/70 mb-1">Available balance</p>
        <p className="text-2xl font-semibold">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {cardActions.map((action) => (
          <button
            key={action.label}
            className="card py-4 flex flex-col items-center gap-2 hover:border-brand-blue transition-colors"
          >
            <action.icon className="w-6 h-6 text-brand-navy" strokeWidth={1.75} />
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Markets</h2>
        {status === "ready" && (
          <span className="text-xs text-brand-navy/40">Live · updates every 30s</span>
        )}
      </div>

      <div className="card divide-y divide-brand-gray-line">
        {status === "loading" && (
          <div className="px-5 py-6 text-sm text-brand-navy/50">Loading live prices…</div>
        )}
        {status === "error" && (
          <div className="px-5 py-6 text-sm text-brand-danger">
            Couldn't load live prices. Retrying in the background.
          </div>
        )}
        {status === "ready" &&
          crypto.map((c) => (
            <div key={c.symbol} className="flex items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue text-[10px] font-bold">
                {c.symbol}
              </div>
              <div className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-brand-navy/50">{c.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className={c.change >= 0 ? "text-brand-success text-sm" : "text-brand-danger text-sm"}>
                  {c.change >= 0 ? "+" : ""}
                  {c.change.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}