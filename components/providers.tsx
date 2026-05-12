"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { Suspense, useState } from "react"
import { PostHogProvider } from "@/components/providers-posthog"
import { PostHogPageView } from "@/components/posthog-pageview"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
