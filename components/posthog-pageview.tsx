"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog.__loaded) {
      posthog.capture("$pageview", {
        $current_url: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      })
    }
  }, [pathname, searchParams])

  return null
}
