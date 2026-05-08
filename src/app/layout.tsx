import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auton — Agents that pay their own way",
  description:
    "LLM agents that autonomously pay for premium data using HTTP 402 + Solana. No API keys. No billing. No humans.",
  metadataBase: new URL("https://agent.mpptestkit.com"),
  openGraph: {
    title: "Auton — Agents that pay their own way",
    description:
      "LLM agents that autonomously pay for premium data using HTTP 402 + Solana. No API keys. No billing. No humans.",
    type: "website",
  },
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
