"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/hooks/use-localization"
import { useAnalysis } from "@/hooks/use-analysis"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { PageTransition } from "@/components/animations"
import { CameraCapture } from "@/components/camera-capture"
import { Upload, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { useDropzone } from "react-dropzone"
import type { FloorPlanContext } from "@/types"

type Step = "upload" | "context" | "analyzing" | "done" | "error"

export default function AnalyzePage() {
  const { t, locale } = useLocale()
  const router = useRouter()
  const { state, submitAnalysis } = useAnalysis()
  const [step, setStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [context, setContext] = useState<FloorPlanContext>({})

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setStep("context")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
  })

  const handleSubmit = async () => {
    if (!file) return
    setStep("analyzing")
    await submitAnalysis(file, context)

    if (state.status === "completed" && state.reportId) {
      setStep("done")
      setTimeout(() => router.push(`/analyze/result/${state.reportId}`), 1500)
    } else if (state.status === "error") {
      setStep("error")
    }
  }

  return (
    <PageTransition>
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl tracking-tight">{t("analyze.title")}</h1>
        <p className="mt-2 text-[#6B6B6B]">{t("analyze.contextDesc")}</p>
      </div>

      {step === "upload" && (
        <div className="space-y-4">
          <Card>
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                isDragActive
                  ? "border-[#2C4A5A] bg-[#2C4A5A]/5"
                  : "border-[#D4CEC4] hover:border-[#2C4A5A]/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2C4A5A]/10">
                <Upload className="h-8 w-8 text-[#2C4A5A]" />
              </div>
              <p className="text-lg font-medium">{t("analyze.uploadTitle")}</p>
              <p className="mt-1 text-sm text-[#6B6B6B]">{t("analyze.uploadDesc")}</p>
              <p className="mt-4 text-xs text-[#8B8B8B]">{t("analyze.uploadHint")}</p>
            </div>
          </Card>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D4CEC4]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#F5F0EB] px-2 text-[#8B8B8B]">or</span>
            </div>
          </div>
          <CameraCapture
            onCapture={(file) => {
              setFile(file)
              setPreview(URL.createObjectURL(file))
              setStep("context")
            }}
          />
        </div>
      )}

      {step === "context" && preview && (
        <div className="space-y-6">
          <Card>
            <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-[#EDE8E1]">
              <img src={preview} alt="Floor plan" className="h-full w-full object-contain" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFile(null)
                setPreview(null)
                setStep("upload")
              }}
            >
              {locale === "en" ? "Upload different image" : "重新上传"}
            </Button>
          </Card>

          <Card>
            <h3 className="mb-4 font-serif text-lg font-medium">{t("analyze.contextTitle")}</h3>
            <p className="mb-6 text-sm text-[#6B6B6B]">{t("analyze.contextDesc")}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("analyze.direction")}</Label>
                <Input
                  placeholder={t("analyze.directionPlaceholder")}
                  value={context.direction ?? ""}
                  onChange={(e) => setContext((c) => ({ ...c, direction: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("analyze.city")}</Label>
                <Input
                  placeholder="e.g., Shanghai"
                  value={context.city ?? ""}
                  onChange={(e) => setContext((c) => ({ ...c, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("analyze.floor")}</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={context.floor ?? ""}
                  onChange={(e) => setContext((c) => ({ ...c, floor: parseInt(e.target.value) || undefined }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("analyze.totalFloors")}</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={context.totalFloors ?? ""}
                  onChange={(e) => setContext((c) => ({ ...c, totalFloors: parseInt(e.target.value) || undefined }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("analyze.occupants")}</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={context.occupants ?? ""}
                  onChange={(e) => setContext((c) => ({ ...c, occupants: parseInt(e.target.value) || undefined }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("analyze.environment")}</Label>
                <Input
                  placeholder={t("analyze.environmentPlaceholder")}
                  value={context.externalEnvironment?.join(", ") ?? ""}
                  onChange={(e) =>
                    setContext((c) => ({
                      ...c,
                      externalEnvironment: e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [],
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label>{t("analyze.issues")}</Label>
              <Input
                placeholder={t("analyze.issuesPlaceholder")}
                value={context.currentIssues?.join(", ") ?? ""}
                onChange={(e) =>
                  setContext((c) => ({
                    ...c,
                    currentIssues: e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [],
                  }))
                }
              />
            </div>
          </Card>

          <div className="flex justify-center">
            <Button size="lg" onClick={handleSubmit}>
              {t("analyze.submit")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <Card className="text-center">
          <div className="flex flex-col items-center py-8">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#2C4A5A]" />
            <p className="text-lg font-medium">{t("analyze.analyzing")}</p>
            <p className="mt-2 text-sm text-[#6B6B6B]">{t("analyze.progress")}</p>
            <Progress value={state.progress} className="mt-6 w-full max-w-sm" />
            <p className="mt-2 text-xs text-[#8B8B8B]">{state.progress}%</p>
          </div>
        </Card>
      )}

      {step === "done" && (
        <Card className="text-center">
          <div className="flex flex-col items-center py-8">
            <CheckCircle2 className="mb-4 h-10 w-10 text-green-600" />
            <p className="text-lg font-medium">{t("analyze.success")}</p>
            <p className="mt-1 text-sm text-[#6B6B6B]">{locale === "en" ? "Redirecting to report..." : "正在跳转到报告..."}</p>
          </div>
        </Card>
      )}

      {step === "error" && (
        <Card className="text-center">
          <div className="flex flex-col items-center py-8">
            <AlertCircle className="mb-4 h-10 w-10 text-[#8B2500]" />
            <p className="text-lg font-medium">{t("analyze.error")}</p>
            <p className="mt-1 text-sm text-[#6B6B6B]">{state.error}</p>
            <Button variant="outline" className="mt-4" onClick={() => setStep("upload")}>
              {t("common.retry")}
            </Button>
          </div>
        </Card>
      )}
    </div>
    </PageTransition>
  )
}
