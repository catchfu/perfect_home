"use client"

import { useCallback } from "react"
import type { Locale } from "@/lib/i18n"
import { getMessages, t as translate } from "@/lib/i18n"

const LOCALE_KEY = "ph-locale"

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored === "en" || stored === "zh") return stored
  return "en"
}

function storeLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_KEY, locale)
  }
}

export function useLocale() {
  const locale: Locale = getStoredLocale()

  const setLocale = useCallback((newLocale: Locale) => {
    storeLocale(newLocale)
    window.location.reload()
  }, [])

  const tFn = useCallback(
    (path: string, params?: Record<string, string | number>) =>
      translate(path, locale, params),
    [locale]
  )

  const messages = getMessages(locale)

  return { locale, setLocale: setLocale, t: tFn, messages, isEn: locale === "en", isZh: locale === "zh" }
}

export function getT(locale: Locale) {
  return (path: string, params?: Record<string, string | number>) =>
    translate(path, locale, params)
}
