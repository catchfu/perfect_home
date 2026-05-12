import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const plans = await prisma.floorPlan.findMany({
      where: { userId: session.user.id },
      include: {
        report: {
          select: { id: true, title: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const reports = plans
      .filter((p) => p.report)
      .map((p) => ({
        id: p.report!.id,
        title: p.report!.title,
        createdAt: p.report!.createdAt,
        imageUrl: p.imageUrl,
      }))

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Fetch reports error:", error)
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}
