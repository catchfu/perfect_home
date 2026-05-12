import en from "@/messages/en.json"
import zh from "@/messages/zh.json"

export type Locale = "en" | "zh"

const messages: Record<Locale, typeof en> = { en, zh }

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages.en
}

export function t(
  path: string,
  locale: Locale = "en",
  params?: Record<string, string | number>
): string {
  const keys = path.split(".")
  let value: any = messages[locale] ?? messages.en

  for (const key of keys) {
    value = value?.[key]
  }

  if (typeof value !== "string") return path

  if (params) {
    return Object.entries(params).reduce(
      (str, [key, val]) => str.replace(`{${key}}`, String(val)),
      value
    )
  }

  return value
}
