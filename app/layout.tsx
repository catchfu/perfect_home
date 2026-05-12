import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ServiceWorkerRegister } from "@/components/service-worker-register"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://perfecthome.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s — Perfect Home",
    default: "Perfect Home — Honest Floor Plan Diagnostics",
  },
  description:
    "AI-powered home layout diagnosis that exposes problems — not sugar-coats them. Know exactly what you're living with before you buy or rent.",
  keywords: [
    "floor plan analysis",
    "home layout diagnosis",
    "feng shui checker",
    "property inspection",
    "home buying assistant",
    "户型分析",
    "风水诊断",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Perfect Home",
  },
  openGraph: {
    title: "Perfect Home — Honest Floor Plan Diagnostics",
    description:
      "AI-powered home layout diagnosis that exposes problems. Know exactly what you're living with.",
    url: siteUrl,
    siteName: "Perfect Home",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Perfect Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Home",
    description: "AI-powered floor plan diagnosis that tells you the truth.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Perfect Home",
  description: "AI-powered floor plan diagnosis tool that identifies structural, flow, lighting, and Feng Shui problems.",
  url: siteUrl,
  applicationCategory: "HomeApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ServiceWorkerRegister />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
