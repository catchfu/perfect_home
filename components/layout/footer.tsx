"use client"

import { useLocale } from "@/hooks/use-localization"

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-[#D4CEC4] bg-[#EDE8E1]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:px-6 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <span className="font-serif text-lg tracking-tight">Perfect Home</span>
          <p className="text-sm text-[#6B6B6B]">{t("footer.tagline")}</p>
        </div>
        <p className="text-xs text-[#8B8B8B]">
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </p>
      </div>
    </footer>
  )
}
