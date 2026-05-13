import { NextRequest, NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") ?? ""

    const event = getStripeClient().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    )

    if (event.type === "checkout.session.completed") {
      const stripeEvent = event as { type: string; data: { object: Record<string, unknown> } }
      const session = stripeEvent.data.object
      const userId = session.metadata as Record<string, string> | undefined
      const uid = userId?.userId
      const credits = parseInt(userId?.credits ?? "0")

      if (uid && credits > 0) {
        await prisma.user.update({
          where: { id: uid },
          data: { credits: { increment: credits } },
        })

        await prisma.payment.create({
          data: {
            userId: uid,
            stripeSessionId: session.id as string,
            amount: (session.amount_total as number) ?? 0,
            credits,
            status: "completed",
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }
}
