"use client"

import { useState } from "react"
import type { FloorPlanContext, DiagnosisReportData } from "@/types"

interface AnalysisState {
  status: "idle" | "uploading" | "analyzing" | "completed" | "error"
  progress: number
  reportId: string | null
  error: string | null
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: "idle",
    progress: 0,
    reportId: null,
    error: null,
  })

  const submitAnalysis = async (file: File, context?: FloorPlanContext) => {
    setState({ status: "uploading", progress: 0, reportId: null, error: null })

    try {
      const formData = new FormData()
      formData.append("file", file)
      if (context) formData.append("context", JSON.stringify(context))

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const { id } = await res.json()
      setState({ status: "analyzing", progress: 10, reportId: id, error: null })

      await pollAnalysis(id)
    } catch (err) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err instanceof Error ? err.message : "Analysis failed",
      }))
    }
  }

  const pollAnalysis = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/analysis/${id}`)
          const data = await res.json()

          if (data.status === "completed") {
            clearInterval(interval)
            setState({ status: "completed", progress: 100, reportId: id, error: null })
            resolve()
          } else if (data.status === "failed") {
            clearInterval(interval)
            setState({ status: "error", progress: 0, reportId: null, error: data.error })
            reject(new Error(data.error))
          } else {
            setState((prev) => ({
              ...prev,
              progress: data.progress ?? prev.progress,
            }))
          }
        } catch {
          clearInterval(interval)
          reject(new Error("Polling failed"))
        }
      }, 2000)
    })
  }

  return { state, submitAnalysis }
}
