import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export const GlassCard = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card/30 backdrop-blur-md border border-border/50 rounded-xl shadow-xl overflow-hidden",
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"
