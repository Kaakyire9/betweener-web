import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/common/site-footer";
import { SiteHeader } from "@/components/common/site-header";
import { buildMetadata } from "@/lib/metadata";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"]
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata: Metadata = buildMetadata({
  title: "Betweener | Intentional dating with depth, trust, and momentum",
  description:
    "Betweener is a premium intentional dating app built around trust, chemistry, context, and real-world follow-through."
});

export const viewport: Viewport = {
  themeColor: "#070a12",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <div className="relative isolate min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_40%)]" />
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}