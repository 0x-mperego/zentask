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
      default: "bg-gray-100 text-gray-800 border-gray-200",
      success: "bg-green-100 text-green-800 border-green-200",
      error: "bg-red-100 text-red-800 border-red-200", 
      warning: "bg-orange-100 text-orange-800 border-orange-200",
      info: "bg-blue-100 text-blue-800 border-blue-200"
    }

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm", 
      lg: "px-4 py-2 text-base"
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