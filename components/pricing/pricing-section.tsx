"use client"

import { useLocale } from "@/hooks/use-localization"
import { useCheckout } from "@/hooks/use-checkout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"

const PLANS = [
  {
    id: "free",
    nameKey: "free",
    priceKey: "priceFree",
    periodKey: "periodFree",
    credits: 3,
    popular: false,
    featuresKey: "freeFeatures",
  },
  {
    id: "pro",
    nameKey: "proName",
    priceKey: "proPrice",
    periodKey: "proPeriod",
    credits: 20,
    popular: true,
    featuresKey: "proFeatures",
  },
  {
    id: "credits10",
    nameKey: "tenPackName",
    priceKey: "tenPackPrice",
    periodKey: "oneTime",
    credits: 10,
    popular: false,
    featuresKey: "tenPackFeatures",
  },
  {
    id: "credits30",
    nameKey: "thirtyPackName",
    priceKey: "thirtyPackPrice",
    periodKey: "oneTime",
    credits: 30,
    popular: false,
    featuresKey: "thirtyPackFeatures",
  },
]

const L: Record<string, { en: string; zh: string }> = {
  free: { en: "Free", zh: "免费版" },
  proName: { en: "Pro Monthly", zh: "专业版 (月付)" },
  proPrice: { en: "$9", zh: "¥29" },
  proPeriod: { en: "/month", zh: "/月" },
  tenPackName: { en: "10 Extra Credits", zh: "10 次加量包" },
  tenPackPrice: { en: "$4.99", zh: "¥19" },
  tenPackFeatures: { en: "Monthly subscription", zh: "月付订阅" },
  thirtyPackName: { en: "30 Extra Credits", zh: "30 次超值包" },
  thirtyPackPrice: { en: "$9.99", zh: "¥39" },
  oneTime: { en: "one-time", zh: "一次性" },
  priceFree: { en: "$0", zh: "¥0" },
  periodFree: { en: "forever", zh: "永久" },
}

const FEATURES: Record<string, { en: string[]; zh: string[] }> = {
  freeFeatures: {
    en: ["3 diagnoses", "Basic report", "Watermark on downloads"],
    zh: ["3 次诊断", "基础报告", "下载带水印"],
  },
  proFeatures: {
    en: ["20 diagnoses per month", "Full detailed report", "No watermark", "PDF download", "Priority support"],
    zh: ["每月 20 次诊断", "完整详细报告", "无水印", "PDF 下载", "优先支持"],
  },
  tenPackFeatures: {
    en: ["10 one-time diagnoses", "No expiry", "Full report"],
    zh: ["10 次一次性诊断", "永不过期", "完整报告"],
  },
  thirtyPackFeatures: {
    en: ["30 one-time diagnoses", "No expiry", "Full report", "PDF download"],
    zh: ["30 次一次性诊断", "永不过期", "完整报告", "PDF 下载"],
  },
}

function label(key: string, locale: "en" | "zh"): string {
  return L[key]?.[locale] ?? key
}

function features(key: string, locale: "en" | "zh"): string[] {
  return FEATURES[key]?.[locale] ?? []
}

export default function PricingSection() {
  const { locale } = useLocale()
  const { checkout, loading } = useCheckout()
  const isEn = locale === "en"

  return (
    <div id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl tracking-tight">
          {isEn ? "Simple, Transparent Pricing" : "简洁透明的定价"}
        </h1>
        <p className="mt-4 text-lg text-[#6B6B6B]">
          {isEn ? "Start free. Upgrade when you need more." : "免费开始，按需升级。"}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              plan.popular ? "border-[#2C4A5A] ring-2 ring-[#2C4A5A]" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2C4A5A] px-4 py-1 text-xs text-white flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="h-3 w-3" />
                {isEn ? "Most Popular" : "最受欢迎"}
              </div>
            )}
            <div className="mb-6">
              <h3 className="font-serif text-xl font-medium">{label(plan.nameKey, locale)}</h3>
              <div className="mt-2">
                <span className="font-serif text-3xl font-medium">{label(plan.priceKey, locale)}</span>
                <span className="ml-1 text-sm text-[#6B6B6B]">{label(plan.periodKey, locale)}</span>
              </div>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {plan.credits > 0
                  ? isEn
                    ? `${plan.credits} diagnoses`
                    : `${plan.credits} 次诊断`
                  : "Unlimited"}
              </p>
            </div>
            <div className="flex-1 space-y-3">
              {features(plan.featuresKey, locale).map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2C4A5A]" />
                  <span className="text-sm text-[#6B6B6B]">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              {plan.id === "free" ? (
                <Link href="/analyze">
                  <Button variant="outline" className="w-full">
                    {isEn ? "Get Started" : "免费开始"}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => checkout(plan.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isEn ? "Purchase" : "购买"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
