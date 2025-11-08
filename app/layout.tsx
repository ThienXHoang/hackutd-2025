import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spellbook Savings",
  description: "Use your finance knowledge to unlock spells.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
