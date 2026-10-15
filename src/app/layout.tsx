import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

import { Providers } from "@/components/site/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Physicist — Exploring the Universe, One Fundamental Question at a Time",
    template: "%s — The Physicist",
  },
  description:
    "A personal portfolio of a physics enthusiast and scientific thinker: research interests, scientific projects, notes, and an interactive physics laboratory exploring spacetime, quantum mechanics, and the cosmos.",
  keywords: [
    "physics",
    "theoretical physics",
    "quantum mechanics",
    "general relativity",
    "cosmology",
    "mathematical physics",
    "scientific computing",
    "portfolio",
  ],
  authors: [{ name: "The Physicist" }],
  openGraph: {
    title: "The Physicist — Exploring the Universe, One Fundamental Question at a Time",
    description:
      "Research interests, scientific projects, notes, and an interactive physics laboratory — a digital universe exploring the fundamental laws of nature.",
    url: siteUrl,
    siteName: "The Physicist",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1344,
        height: 768,
        alt: "A black hole with a glowing accretion disk — the portfolio's opening image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Physicist — Exploring the Universe, One Fundamental Question at a Time",
    description:
      "A digital universe exploring the fundamental laws of nature — research, projects, notes, and an interactive physics laboratory.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${plexMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
