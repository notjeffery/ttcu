"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Home, BarChart3, Wallet, User } from "lucide-react";

type MonthPoint = { label: string; value: number };
type Stat = { label: string; value: string };
type Transaction = { name: string; date: string; amount: string };

function SpendingChart({ data }: { data: MonthPoint[] }) {
  const width = 320;
  const height = 160;
  const paddingX = 8;
  const paddingTop = 12;
  const paddingBottom = 28;

  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const stepX = (width - paddingX * 2) / Math.max(data.length - 1, 1);
  const usableHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = paddingTop + usableHeight - ((d.value - min) / range) * usableHeight;
    return { x, y, label: d.label };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${
    height - paddingBottom
  } L ${points[0].x.toFixed(2)} ${height - paddingBottom} Z`;

  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spendGradient)" />
      <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="5" fill="#2563eb" />
      {points.map((p) => (
        <text key={p.label} x={p.x} y={height - 6} textAnchor="middle" fontSize="11" fill="#8a94a6">
          {p.label}
        </text>
      ))}
    </svg>
  );
}

export default function AnalyticsClient({
  monthlyData,
  totalSpending30d,
  stats,
  spendingTransactions,
  incomeTransactions,
}: {
  monthlyData: MonthPoint[];
  totalSpending30d: number;
  stats: Stat[];
  spendingTransactions: Transaction[];
  incomeTransactions: Transaction[];
}) {
  const lastMonth = monthlyData[monthlyData.length - 1];
  const [activeTab, setActiveTab] = useState<"spending" | "income">("spending");
  const transactions = activeTab === "spending" ? spendingTransactions : incomeTransactions;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-[#0f2544]">Analytics</h1>
        </div>

        <p className="text-sm text-slate-500 mb-1">Total spending (last 30 days)</p>
        <p className="text-4xl font-bold text-[#0f2544] mb-6">
          ${totalSpending30d.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-[#0f2544] leading-tight">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500 mb-1">{lastMonth?.label ?? "This month"} spending</p>
          <p className="text-2xl font-bold text-[#0f2544] mb-3">
            ${(lastMonth?.value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <SpendingChart data={monthlyData} />
        </div>

        <div className="mt-6 mb-2 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("spending")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === "spending" ? "bg-blue-600 text-white" : "text-slate-500"
            }`}
          >
            Spending
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("income")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === "income" ? "bg-blue-600 text-white" : "text-slate-500"
            }`}
          >
            Income
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          {transactions.length === 0 && (
            <p className="px-5 py-6 text-sm text-slate-500">No {activeTab} transactions yet.</p>
          )}
          {transactions.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className={`flex items-center justify-between px-5 py-4 ${
                i !== transactions.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[#0f2544]">{t.name}</p>
                <p className="text-xs text-slate-500">{t.date}</p>
              </div>
              <p
                className={`font-mono text-sm font-medium ${
                  t.amount.startsWith("-") ? "text-[#0f2544]" : "text-emerald-600"
                }`}
              >
                {t.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-md items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/analytics" className="flex flex-col items-center gap-1 text-blue-600">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs font-medium">Analytics</span>
          </Link>
          <Link href="/wallet" className="flex flex-col items-center gap-1 text-slate-400">
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Wallet</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}