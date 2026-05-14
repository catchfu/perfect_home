"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useLocale } from "@/hooks/use-localization"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/report/share-buttons"
import { PdfExport } from "@/components/report/pdf-export"
import {
  AlertTriangle,
  MapPin,
  Target,
  Image as ImageIcon,
} from "lucide-react"
import type { DiagnosisReportData, Problem, Priority, Recommendation } from "@/types"

const categoryLabels: Record<string, { en: string; zh: string }> = {
  entrance: { en: "Entrance", zh: "入户" },
  flow: { en: "Circulation", zh: "动线" },
  living_room: { en: "Living Room", zh: "客厅" },
  bedroom: { en: "Bedroom", zh: "卧室" },
  kitchen: { en: "Kitchen", zh: "厨房" },
  bathroom: { en: "Bathroom", zh: "卫生间" },
  lighting: { en: "Lighting & Ventilation", zh: "采光通风" },
  storage: { en: "Storage", zh: "收纳" },
  feng_shui: { en: "Feng Shui", zh: "风水形势" },
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const { locale } = useLocale()
  const isEn = locale === "en"

  const { data: report, isLoading } = useQuery<DiagnosisReportData>({
    queryKey: ["report", id],
    queryFn: async () => {
      const res = await fetch(`/api/analysis/${id}`)
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#6B6B6B]">{isEn ? "Loading report..." : "加载报告中..."}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg text-[#6B6B6B]">{isEn ? "Report not found" : "报告未找到"}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-3xl tracking-tight">{report.title}</h1>
            <p className="mt-1 text-[#6B6B6B]">{isEn ? "Problems only. No fluff." : "只讲问题，不讲空话。"}</p>
          </div>
          <div className="flex gap-2">
            <ShareButtons title={report.title} />
            <PdfExport reportId={report.floorPlanId} />
            <Button variant="outline" size="sm">
              <ImageIcon className="mr-2 h-4 w-4" />
              {isEn ? "PNG" : "PNG"}
            </Button>
          </div>
        </div>
      </div>

      <Card className="mb-8 overflow-hidden">
        <div className="aspect-[16/9] bg-[#EDE8E1] flex items-center justify-center">
          {report.infographicLandscape ? (
            <img
              src={report.infographicLandscape}
              alt="Floor plan diagnosis"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#8B8B8B]">
              <MapPin className="h-12 w-12" />
              <p className="text-sm">
                {isEn ? "Annotated floor plan" : "户型标注图"}
              </p>
            </div>
          )}
        </div>
        {report.direction && (
          <div className="border-t border-[#D4CEC4] px-6 py-3 text-xs text-[#6B6B6B]">
            {isEn ? "Direction" : "方向"}: {report.direction}
          </div>
        )}
      </Card>

      {report.problems && report.problems.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-serif text-2xl tracking-tight">
            {isEn ? "Key Issues" : "核心问题"}
          </h2>
          <div className="space-y-3">
            {report.problems.map((problem: Problem, i: number) => (
              <Card key={problem.id} className="flex items-start gap-4">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    problem.severity >= 4
                      ? "bg-[#8B2500]"
                      : problem.severity >= 3
                        ? "bg-[#A0522D]"
                        : "bg-[#8B8B8B]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#2C4A5A]/10 px-2 py-0.5 text-xs text-[#2C4A5A]">
                      {problem.zone}
                    </span>
                    <span className="text-xs text-[#8B8B8B]">
                      {categoryLabels[problem.category]?.[locale] ?? problem.category}
                    </span>
                    <span
                      className={`text-xs ${
                        problem.severity >= 4
                          ? "text-[#8B2500]"
                          : problem.severity >= 3
                            ? "text-[#A0522D]"
                            : "text-[#8B8B8B]"
                      }`}
                    >
                      {isEn ? "Severity" : "严重度"}: {problem.severity}/5
                    </span>
                  </div>
                  <p className="font-medium">{problem.issue}</p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">{problem.consequence}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {report.causalChain && (
        <Card className="mb-8">
          <h2 className="mb-2 font-serif text-xl tracking-tight">
            {isEn ? "Root Cause Chain" : "因果链"}
          </h2>
          <p className="text-[#6B6B6B]">{report.causalChain}</p>
        </Card>
      )}

      {report.priorities && report.priorities.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-serif text-2xl tracking-tight">
            {isEn ? "What to Fix First" : "先改什么"}
          </h2>
          <div className="space-y-3">
            {report.priorities.map((priority: Priority) => (
              <Card key={priority.level} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C4A5A] text-xs font-bold text-white">
                  {priority.level}
                </div>
                <div>
                  <p className="font-medium">{priority.title}</p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">{priority.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {report.recommendations && report.recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-serif text-2xl tracking-tight">
            {isEn ? "Actionable Fixes" : "落地调整方案"}
          </h2>
          <div className="space-y-3">
            {report.recommendations.map((rec: Recommendation, i: number) => (
              <Card key={i} className="flex items-start gap-4">
                <Target className="mt-1 h-5 w-5 shrink-0 text-[#2C4A5A]" />
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#2C4A5A]/10 px-2 py-0.5 text-xs text-[#2C4A5A]">
                      {rec.zone}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        rec.cost === "low"
                          ? "bg-green-100 text-green-700"
                          : rec.cost === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rec.cost === "low"
                        ? isEn
                          ? "Low cost"
                          : "低成本"
                        : rec.cost === "medium"
                          ? isEn
                            ? "Medium cost"
                            : "中成本"
                          : isEn
                            ? "High cost"
                            : "高成本"}
                    </span>
                  </div>
                  <p className="font-medium">{rec.action}</p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">{rec.effect}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {report.bottomLine && (
        <Card className="border-l-4 border-l-[#2C4A5A]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#2C4A5A]" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                {isEn ? "Bottom Line" : "一句诀"}
              </p>
              <p className="mt-1 font-serif text-lg">{report.bottomLine}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
