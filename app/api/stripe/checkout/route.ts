import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStripeClient, PLANS } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await req.json()
    const allPlans = PLANS as Record<string, { name: string; credits: number; amount?: number }>
    const plan = allPlans[planId]
    if (!plan || !plan.amount) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    const checkoutSession = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} — Perfect Home`,
              description: `${plan.credits} floor plan diagnoses`,
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        planId,
        credits: String(plan.credits),
      },
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?cancelled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
