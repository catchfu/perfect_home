import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if it's a job status request
    const job = await prisma.analysisJob.findFirst({
      where: { floorPlanId: id },
      orderBy: { createdAt: "desc" },
    })

    if (job) {
      if (job.status !== "completed") {
        return NextResponse.json({
          status: job.status,
          progress: job.progress,
          error: job.errorMessage,
        })
      }
    }

    const report = await prisma.diagnosisReport.findUnique({
      where: { floorPlanId: id },
      include: {
        floorPlan: true,
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: report.id,
      floorPlanId: report.floorPlanId,
      title: report.title,
      direction: report.direction,
      problems: report.problems,
      causalChain: report.causalChain,
      priorities: report.priorities,
      recommendations: report.recommendations,
      bottomLine: report.bottomLine,
      infographicLandscape: report.infographicLandscape,
      infographicPortrait: report.infographicPortrait,
      createdAt: report.createdAt,
    })
  } catch (error) {
    console.error("Fetch report error:", error)
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    )
  }
}
