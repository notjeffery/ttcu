"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <div>
      <p className="text-sm text-brand-navy/60">{greeting}</p>
      <p className="text-xl font-semibold text-brand-navy">{name}</p>
    </div>
  );
}