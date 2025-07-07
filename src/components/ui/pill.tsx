import * as React from "react"
import { cn } from "@/lib/utils"

interface PillProps {
  children: React.ReactNode
  variant?: "default" | "success" | "error" | "warning" | "info"
  size?: "sm" | "md" | "lg"
  className?: string
  avatar?: React.ReactNode
  status?: boolean
  statusColor?: string
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  ({ children, variant = "default", size = "md", className, avatar, status, statusColor, ...props }, ref) => {
    const variants = {
      default: "bg-transparent border-[oklch(26%_0_0)] text-[oklch(72%_0_0)]",
      success: "bg-transparent border-[oklch(26%_0_0)] text-[oklch(72%_0_0)]",
      error: "bg-transparent border-[oklch(26%_0_0)] text-[oklch(72%_0_0)]", 
      warning: "bg-transparent border-[oklch(26%_0_0)] text-[oklch(72%_0_0)]",
      info: "bg-transparent border-[oklch(26%_0_0)] text-[oklch(72%_0_0)]"
    }

    const sizes = {
      sm: "px-2.5 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm", 
      lg: "px-2.5 py-0.5 text-base"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {status && statusColor && (
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        )}
        {avatar}
        {children}
      </div>
    )
  }
)

Pill.displayName = "Pill"

export { Pill }