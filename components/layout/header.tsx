"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useLocale } from "@/hooks/use-localization"
import { Home, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const { t, locale, setLocale } = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/analyze", label: t("nav.analyze") },
    { href: "/how-it-works", label: t("nav.howItWorks") },
    { href: "/pricing", label: t("nav.pricing") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D4CEC4] bg-[#F5F0EB]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl tracking-tight">
          <Home className="h-5 w-5 text-[#2C4A5A]" />
          Perfect Home
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#6B6B6B] transition-colors hover:text-[#2C2C2C]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="text-sm text-[#6B6B6B] transition-colors hover:text-[#2C2C2C]"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>

          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-[#2C4A5A] px-5 py-2 text-sm text-[#F5F0EB] transition-colors hover:bg-[#1d3340]"
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-full border border-[#D4CEC4] px-5 py-2 text-sm transition-colors hover:bg-[#EDE8E1]"
            >
              {t("nav.signIn")}
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#D4CEC4] bg-[#F5F0EB] px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6B6B6B] transition-colors hover:text-[#2C2C2C]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#D4CEC4]" />
            <button
              onClick={() => setLocale(locale === "en" ? "zh" : "en")}
              className="text-left text-sm text-[#6B6B6B]"
            >
              {locale === "en" ? "中文" : "EN"}
            </button>
            {session ? (
              <Link href="/dashboard" className="text-sm text-[#6B6B6B]">
                {t("nav.dashboard")}
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm text-[#6B6B6B]"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.signIn")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
