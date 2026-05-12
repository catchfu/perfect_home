"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useLocale } from "@/hooks/use-localization"
import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PricingSection from "@/components/pricing/pricing-section"
import { FileText, Plus, Coins, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { t, locale } = useLocale()
  const isEn = locale === "en"

  if (status === "unauthenticated") redirect("/auth/signin")

  const { data: reports } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await fetch("/api/user/reports")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
    enabled: status === "authenticated",
  })

  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("/api/user/payments")
      if (!res.ok) return []
      return res.json()
    },
    enabled: status === "authenticated",
  })

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#6B6B6B]">{t("common.loading")}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl tracking-tight">{t("dashboard.title")}</h1>
        <Link href="/analyze">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {isEn ? "New Analysis" : "新分析"}
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <div className="flex items-center gap-4">
          <Coins className="h-8 w-8 text-[#2C4A5A]" />
          <div>
            <p className="text-sm text-[#6B6B6B]">{t("dashboard.credits")}</p>
            <p className="font-serif text-2xl font-medium">{session?.user?.credits ?? 0}</p>
          </div>
          <div className="ml-auto">
            <Link href="#pricing">
              <Button variant="outline" size="sm">
                {t("dashboard.buyCredits")}
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {payments && payments.length > 0 && (
        <Card className="mb-8">
          <h3 className="mb-4 font-serif text-lg font-medium">{t("dashboard.paymentHistory")}</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between border-b border-[#D4CEC4] pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-[#2C4A5A]" />
                  <div>
                    <p className="text-sm font-medium">
                      {payment.credits} {isEn ? "credits" : "次"}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      <Calendar className="mr-1 inline h-3 w-3" />
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium">
                  ${(payment.amount / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!reports || reports.length === 0 ? (
        <Card className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-[#8B8B8B]" />
          <p className="text-[#6B6B6B]">{t("dashboard.empty")}</p>
          <Link href="/analyze" className="mt-4 inline-block">
            <Button variant="outline">
              {isEn ? "Analyze Your First Floor Plan" : "诊断第一个户型"}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any) => (
            <Link key={report.id} href={`/analyze/result/${report.id}`}>
              <Card className="flex items-center gap-4 transition-colors hover:bg-[#e0d9cf]">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2C4A5A]/10">
                  <FileText className="h-6 w-6 text-[#2C4A5A]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{report.title ?? "Floor Plan Diagnosis"}</p>
                  <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.createdAt)}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <PricingSection />
    </div>
  )
}
