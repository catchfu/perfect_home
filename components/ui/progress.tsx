import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[#EDE8E1]", className)}>
      <div
        className="h-full rounded-full bg-[#2C4A5A] transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
