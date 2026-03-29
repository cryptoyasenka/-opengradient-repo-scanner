import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenGradient Security Checker",
  description: "AI-powered supply chain security analysis verified on-chain via OpenGradient TEE",
  openGraph: {
    title: "OpenGradient Security Checker",
    description: "AI-powered supply chain security analysis for GitHub repositories, verified on-chain via TEE.",
    type: "website",
    siteName: "OpenGradient",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenGradient Security Checker",
    description: "AI-powered supply chain security analysis for GitHub repositories, verified on-chain via TEE.",
  },
  icons: {
    icon: "https://cdn.jsdelivr.net/gh/golldyck/opengradient-brand-skill@main/logos/og-logo-cyan.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0f19]">
        <Script
          src="https://cdn.jsdelivr.net/gh/golldyck/opengradient-brand-skill@main/og-skill.js"
          strategy="afterInteractive"
        />
        <NuqsAdapter>
          <Providers>{children}</Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
