import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ttcu",
  description: "Digital wallet — ttcu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}