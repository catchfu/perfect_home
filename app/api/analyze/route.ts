import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const contextRaw = formData.get("context") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`

    // Upload to R2
    const { uploadToR2 } = await import("@/lib/r2")
    const imageUrl = await uploadToR2(`floor-plans/${fileName}`, buffer, file.type || "image/jpeg")

    const context = contextRaw ? JSON.parse(contextRaw) : {}

    // Deduct credit if user is logged in
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user || user.credits < 1) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
      }
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      })
    }

    const floorPlan = await prisma.floorPlan.create({
      data: {
        userId: session?.user?.id,
        imageUrl,
        context: context,
        direction: context.direction ?? null,
        status: "pending",
      },
    })

    await prisma.analysisJob.create({
      data: {
        floorPlanId: floorPlan.id,
        status: "queued",
      },
    })

    // Trigger async analysis
    analyzeFloorPlan(floorPlan.id).catch((err) =>
      console.error("Analysis failed:", err)
    )

    return NextResponse.json({ id: floorPlan.id })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

async function analyzeFloorPlan(floorPlanId: string) {
  try {
    await prisma.analysisJob.updateMany({
      where: { floorPlanId },
      data: { status: "processing", progress: 10, startedAt: new Date() },
    })

    const floorPlan = await prisma.floorPlan.findUnique({
      where: { id: floorPlanId },
    })

    if (!floorPlan) throw new Error("Floor plan not found")

    // For MVP: generate mock diagnosis data
    // In production, replace with actual AI API call
    const mockProblems = [
      {
        id: "01",
        zone: "Entrance",
        issue: "Door directly faces living room with no buffer",
        consequence: "Privacy weak, air flow too direct, lack of spatial stability upon entry",
        category: "entrance",
        severity: 4,
      },
      {
        id: "02",
        zone: "Living Room",
        issue: "Living room acts as a passageway",
        consequence: "Difficult to create a focused, settled gathering space",
        category: "living_room",
        severity: 4,
      },
      {
        id: "03",
        zone: "Master Bedroom",
        issue: "Bed position affected by door alignment",
        consequence: "Sleep area easily disturbed by circulation flow",
        category: "bedroom",
        severity: 3,
      },
      {
        id: "04",
        zone: "Bathroom",
        issue: "Adjacent to resting area",
        consequence: "Moisture and noise impact bedroom comfort",
        category: "bathroom",
        severity: 3,
      },
      {
        id: "05",
        zone: "Kitchen",
        issue: "Water and fire flow paths cross",
        consequence: "Inconvenient cooking workflow, potential safety concerns",
        category: "kitchen",
        severity: 3,
      },
      {
        id: "06",
        zone: "Hallway",
        issue: "Dark corridor with poor ventilation",
        consequence: "Prone to stuffiness, moisture accumulation, and odor",
        category: "lighting",
        severity: 2,
      },
    ]

    const mockPriorities = [
      {
        level: 1,
        title: "Entrance Buffer",
        description: "Create visual and airflow buffer at entry to improve privacy and spatial stability",
      },
      {
        level: 2,
        title: "Bedroom Tranquility",
        description: "Adjust bed placement or add screening to protect sleep zone from circulation",
      },
      {
        level: 3,
        title: "Bathroom Moisture Control",
        description: "Strengthen ventilation and add dry transition area to reduce humidity spread",
      },
      {
        level: 4,
        title: "Storage & Circulation",
        description: "Add storage without blocking flow paths; clarify main activity zones",
      },
    ]

    const mockRecommendations = [
      {
        zone: "Entry",
        action: "Add half-height cabinet, rug, or screen",
        effect: "Let the entry视线 pause first, no longer see through the entire space at once",
        cost: "low",
      },
      {
        zone: "Master Bedroom",
        action: "Place bed head against solid wall, avoid direct door alignment",
        effect: "Improve sleep zone stability and sense of security",
        cost: "low",
      },
      {
        zone: "Bathroom",
        action: "Enhance exhaust fan, keep door closed, create dry transition zone",
        effect: "Reduce moisture and odor spread to adjacent areas",
        cost: "medium",
      },
      {
        zone: "Living Room",
        action: "Reduce passage clutter, define main activity zone clearly",
        effect: "Improve the focus and settled feeling of the公共 area",
        cost: "low",
      },
      {
        zone: "Kitchen",
        action: "Reorganize stove and sink positions for smoother workflow",
        effect: "Reduce crossed water-fire flow paths",
        cost: "high",
      },
    ]

    await prisma.analysisJob.updateMany({
      where: { floorPlanId },
      data: { status: "completed", progress: 100, completedAt: new Date() },
    })

    await prisma.floorPlan.update({
      where: { id: floorPlanId },
      data: { status: "completed" },
    })

    await prisma.diagnosisReport.create({
      data: {
        floorPlanId,
        title: "Floor Plan Issue Diagnosis",
        direction: floorPlan.direction ?? "Assumed: Top-North, Bottom-South",
        problems: mockProblems,
        causalChain:
          "No entry buffer causes direct exposure of the living room, amplifying the empty feeling of the public space. " +
          "The bedroom near the bathroom with bed affected by door alignment further weakens sleep stability. " +
          "Thus: fix entry buffer first, then bedroom tranquility, then bathroom moisture control.",
        priorities: mockPriorities,
        recommendations: mockRecommendations,
        bottomLine: "Door exposed, hall disperses; Bed unsettled, peace reverses. Fix flow first, then feng shui.",
      },
    })
  } catch (error) {
    console.error("Analysis error:", error)
    await prisma.analysisJob.updateMany({
      where: { floorPlanId },
      data: { status: "failed", errorMessage: error instanceof Error ? error.message : "Unknown error" },
    })
    await prisma.floorPlan.update({
      where: { id: floorPlanId },
      data: { status: "failed" },
    })
  }
}
