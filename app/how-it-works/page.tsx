"use client"

import { useLocale } from "@/hooks/use-localization"
import { Card } from "@/components/ui/card"
import { Upload, Search, FileText, Home, Lightbulb, ListChecks, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HowItWorksPage() {
  const { locale } = useLocale()

  const isEn = locale === "en"

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl tracking-tight">
          {isEn ? "How It Works" : "如何运作"}
        </h1>
        <p className="mt-4 text-lg text-[#6B6B6B]">
          {isEn
            ? "From floor plan to diagnosis report in 3 simple steps."
            : "户型图到诊断报告，只需三步。"}
        </p>
      </div>

      <div className="space-y-12">
        <Card>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2C4A5A]/10">
              <Upload className="h-8 w-8 text-[#2C4A5A]" />
            </div>
            <div>
              <div className="mb-1 inline-block rounded-full bg-[#2C4A5A] px-3 py-0.5 text-xs text-white">
                {isEn ? "Step 1" : "第一步"}
              </div>
              <h2 className="mt-2 font-serif text-xl font-medium">
                {isEn ? "Upload Your Floor Plan" : "上传户型图"}
              </h2>
              <p className="mt-2 text-[#6B6B6B]">
                {isEn
                  ? "Drag & drop any floor plan image — developer drawings, CAD files, hand sketches, or real estate photos. Add optional context like door direction, city, floor level, and external environment for more accurate analysis."
                  : "拖入任何户型图 — 开发商图纸、CAD、手绘或房产照片均可。可添加入户朝向、城市、楼层、外部环境等补充信息以提高诊断准确度。"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2C4A5A]/10">
              <Search className="h-8 w-8 text-[#2C4A5A]" />
            </div>
            <div>
              <div className="mb-1 inline-block rounded-full bg-[#2C4A5A] px-3 py-0.5 text-xs text-white">
                {isEn ? "Step 2" : "第二步"}
              </div>
              <h2 className="mt-2 font-serif text-xl font-medium">
                {isEn ? "AI Deep Diagnosis" : "AI 深度诊断"}
              </h2>
              <p className="mt-2 text-[#6B6B6B]">
                {isEn
                  ? "Our AI analyzes your floor plan across 8 categories: entrance flow, circulation, living spaces, bedrooms, kitchen, bathroom, lighting & ventilation, and storage. It identifies problems, traces causal chains, and prioritizes fixes."
                  : "AI 从 8 个维度分析您的户型：入户、动线、客厅、卧室、厨房、卫生间、采光通风和收纳。识别问题、追溯因果链、排列修复优先级。"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2C4A5A]/10">
              <FileText className="h-8 w-8 text-[#2C4A5A]" />
            </div>
            <div>
              <div className="mb-1 inline-block rounded-full bg-[#2C4A5A] px-3 py-0.5 text-xs text-white">
                {isEn ? "Step 3" : "第三步"}
              </div>
              <h2 className="mt-2 font-serif text-xl font-medium">
                {isEn ? "Get Your Diagnosis Report" : "获取诊断报告"}
              </h2>
              <p className="mt-2 text-[#6B6B6B]">
                {isEn
                  ? "Receive a clear, visual report showing annotated problem areas, priority rankings, causal chain analysis, and actionable recommendations. Download as infographic or share with your family or agent."
                  : "获取清晰的可视化报告，包含标注问题区域、优先级排序、因果链分析和可操作的改进建议。可下载信息图，或分享给家人和中介。"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <h2 className="mb-4 font-serif text-xl font-medium">
            {isEn ? "8 Diagnostic Categories" : "8 大诊断维度"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Home, label: isEn ? "Entrance & Foyer" : "入户区" },
              { icon: ArrowRight, label: isEn ? "Circulation Flow" : "动线" },
              { icon: Lightbulb, label: isEn ? "Living Room" : "客厅" },
              { icon: Home, label: isEn ? "Bedrooms" : "卧室" },
              { icon: Home, label: isEn ? "Kitchen" : "厨房" },
              { icon: Home, label: isEn ? "Bathroom" : "卫生间" },
              { icon: Lightbulb, label: isEn ? "Lighting & Ventilation" : "采光通风" },
              { icon: ListChecks, label: isEn ? "Storage" : "收纳" },
            ].map((cat, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-[#D4CEC4] bg-[#F5F0EB] px-4 py-3">
                <cat.icon className="h-4 w-4 text-[#2C4A5A]" />
                <span className="text-sm">{cat.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <Link href="/analyze">
          <Button size="lg">
            {isEn ? "Analyze Your Floor Plan" : "诊断你的户型"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
