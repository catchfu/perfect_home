"use client"

import Link from "next/link"
import { useLocale } from "@/hooks/use-localization"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  const { locale } = useLocale()
  const isEn = locale === "en"

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE8E1]">
        <WifiOff className="h-10 w-10 text-[#6B6B6B]" />
      </div>
      <h1 className="font-serif text-3xl tracking-tight">
        {isEn ? "You're Offline" : "您已离线"}
      </h1>
      <p className="mt-4 text-[#6B6B6B]">
        {isEn
          ? "Check your connection and try again. Your saved reports are still available."
          : "请检查网络连接。已保存的报告仍然可用。"}
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="outline">
            {isEn ? "Back Home" : "返回首页"}
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button>
            {isEn ? "My Reports" : "我的报告"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
