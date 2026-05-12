import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripeClient(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }
    stripeInstance = new Stripe(key)
  }
  return stripeInstance
}

export const PLANS = {
  free: { name: "Free", credits: 3, priceId: null },
  pro: { name: "Pro", credits: 20, priceId: "", amount: 900 },
  credits10: { name: "Extra Credits (10)", credits: 10, priceId: "", amount: 499 },
  credits30: { name: "Extra Credits (30)", credits: 30, priceId: "", amount: 999 },
} as const
