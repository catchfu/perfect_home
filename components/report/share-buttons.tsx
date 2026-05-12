"use client"

import { Button } from "@/components/ui/button"
import { Share2, MessageCircle, QrCode } from "lucide-react"
import { useLocale } from "@/hooks/use-localization"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  url?: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const { locale } = useLocale()
  const [showQR, setShowQR] = useState(false)
  const isEn = locale === "en"
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "")

  const handleWebShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Perfect Home — " + title,
          text: isEn
            ? "Check out this floor plan diagnosis report"
            : "查看这个户型诊断报告",
          url: shareUrl,
        })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `${isEn ? "Floor Plan Diagnosis: " : "户型诊断报告："}${title}\n${shareUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handleWeChat = () => {
    setShowQR(true)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleWebShare}>
        <Share2 className="mr-2 h-4 w-4" />
        {isEn ? "Share" : "分享"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleWhatsApp}>
        <MessageCircle className="mr-2 h-4 w-4" />
        WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={handleWeChat}>
        <QrCode className="mr-2 h-4 w-4" />
        WeChat
      </Button>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowQR(false)}>
          <div className="rounded-lg bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="mb-4 text-sm text-gray-600">
              {isEn ? "Scan to share on WeChat" : "扫码分享到微信"}
            </p>
            <div className="mx-auto h-48 w-48 bg-gray-100 flex items-center justify-center rounded-lg">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <p className="mt-4 text-xs text-gray-400">
              {isEn ? "QR code for current page URL" : "当前页面二维码"}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setShowQR(false)}
            >
              {isEn ? "Close" : "关闭"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
