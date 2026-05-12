"use client"

import { useState } from "react"

export function useCheckout() {
  const [loading, setLoading] = useState(false)

  const checkout = async (planId: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (!res.ok) throw new Error("Checkout failed")

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      console.error("Checkout error:", err)
    } finally {
      setLoading(false)
    }
  }

  return { checkout, loading }
}
