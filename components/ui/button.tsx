import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C4A5A] disabled:pointer-events-none disabled:opacity-50",
        {
          primary: "bg-[#2C4A5A] text-[#F5F0EB] hover:bg-[#1d3340]",
          secondary: "bg-[#EDE8E1] text-[#2C2C2C] hover:bg-[#e0d9cf]",
          outline: "border border-[#D4CEC4] bg-transparent hover:bg-[#EDE8E1]",
          ghost: "hover:bg-[#EDE8E1]",
          destructive: "bg-[#8B2500] text-[#F5F0EB] hover:bg-[#6e1d00]",
        }[variant],
        {
          sm: "h-8 px-4 text-xs",
          md: "h-10 px-6 text-sm",
          lg: "h-12 px-8 text-base",
        }[size],
        className
      )}
      {...props}
    />
  )
}
