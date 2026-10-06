import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Runtime Ops Desk", template: "%s · Runtime Ops Desk" },
  description: "Independent concept for Runtime's Founding AI Ops seat. Public information only, synthetic data.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/brand/runtm-logo-dark.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
