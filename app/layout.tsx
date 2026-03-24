import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Archivo, Manrope, Playfair_Display } from "next/font/google";

import { SiteFooter } from "@/components/common/site-footer";
import { SiteHeader } from "@/components/common/site-header";
import { buildMetadata } from "@/lib/metadata";

import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"]
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const support = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = buildMetadata({
  title: "Betweener | Intentional dating with depth, trust, and momentum",
  description:
    "Betweener is a premium intentional dating app built around trust, chemistry, context, and real-world follow-through."
});

export const viewport: Viewport = {
  themeColor: "#071311",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${support.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <div className="relative isolate min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,235,221,0.06),transparent_38%)]" />
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}