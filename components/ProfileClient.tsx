"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Copy, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/lib/supabase";

type Customer = {
  name: string;
  memberSinceYear: number;
  email: string;
  phone: string | null;
  accountNumber: string;
  routingNumber: string;
};

function ListRow({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 text-left"
    >
      <div>
        <p className="font-medium">{title}</p>
        {subtitle && <p className="text-sm text-brand-navy/50 mt-0.5">{subtitle}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-brand-navy/40 shrink-0" />
    </button>
  );
}

function ToggleRow({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <p className="font-medium">{title}</p>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
          checked ? "bg-brand-blue justify-end" : "bg-brand-gray-line justify-start"
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-brand-navy shadow" />
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-wide text-brand-navy/50 uppercase mb-2">
      {children}
    </p>
  );
}

export default function ProfileClient({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [copied, setCopied] = useState(false);

  async function handleCopyAccountNumber() {
    try {
      await navigator.clipboard.writeText(customer.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy account number:", err);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-white border border-brand-gray-line flex items-center justify-center text-2xl font-semibold text-brand-blue">
            {customer.name[0]}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{customer.name}</h1>
            <p className="text-brand-navy/50 text-sm">
              Member since {customer.memberSinceYear}
            </p>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <p className="text-sm text-brand-navy/50 mb-4">Checking Account</p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-brand-navy/60">Account number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{customer.accountNumber}</span>
              <button
                type="button"
                onClick={handleCopyAccountNumber}
                aria-label="Copy account number"
                className="text-brand-navy/40 hover:text-brand-blue transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-brand-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-navy/60">Routing number</span>
            <span className="font-mono">{customer.routingNumber}</span>
          </div>
        </div>

        <div className="mb-8">
          <SectionLabel>Personal information</SectionLabel>
          <div className="card divide-y divide-brand-gray-line">
            <ListRow title="Full name" subtitle={customer.name} />
            <ListRow title="Email" subtitle={customer.email} />
            <ListRow title="Phone number" subtitle={customer.phone ?? "Not set"} />
          </div>
        </div>

        <div className="mb-8">
          <SectionLabel>Security</SectionLabel>
          <div className="card divide-y divide-brand-gray-line">
            <ListRow title="Change passcode" />
            <ToggleRow
              title="Biometric login"
              checked={biometricLogin}
              onChange={setBiometricLogin}
            />
          </div>
        </div>

        <div className="mb-8">
          <SectionLabel>Banking</SectionLabel>
          <div className="card divide-y divide-brand-gray-line">
            <ListRow title="Cards & wallet" />
            <ToggleRow
              title="Push notifications"
              checked={pushNotifications}
              onChange={setPushNotifications}
            />
          </div>
        </div>

        <div className="mb-8">
          <SectionLabel>Preferences</SectionLabel>
          <div className="card">
            <ListRow title="App settings" subtitle="Theme, display" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-4 rounded-xl border border-brand-danger text-brand-danger font-medium mb-6"
        >
          Sign out
        </button>

        <p className="text-center text-xs text-brand-navy/40 mb-4">
          Texas Trust Credit Union — v0.1.0 (working build)
        </p>
      </div>

      <BottomNav />
    </div>
  );
}