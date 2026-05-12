import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[#D4CEC4] bg-white px-3 py-2 text-sm placeholder:text-[#8B8B8B] focus:outline-none focus:ring-2 focus:ring-[#2C4A5A] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
