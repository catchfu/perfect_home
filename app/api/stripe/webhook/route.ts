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
      const session = event.data.object as any
      const userId = session.metadata?.userId
      const credits = parseInt(session.metadata?.credits ?? "0")

      if (userId && credits > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: credits } },
        })

        await prisma.payment.create({
          data: {
            userId,
            stripeSessionId: session.id,
            amount: session.amount_total ?? 0,
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
