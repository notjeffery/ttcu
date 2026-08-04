"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Wallet, User } from "lucide-react";

const items = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-white border-t border-brand-gray-line px-4 py-3 flex justify-around max-w-3xl mx-auto">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-xs ${
              active ? "text-brand-blue font-medium" : "text-brand-navy/50"
            }`}
          >
            <item.icon className="w-5 h-5" strokeWidth={active ? 2.25 : 1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
