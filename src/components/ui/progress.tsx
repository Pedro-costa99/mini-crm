import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative h-3 w-full overflow-hidden rounded-full bg-muted/70',
        className,
      )}
      {...props}
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="h-full w-full flex-1 bg-gradient-to-r from-primary to-primary/60 transition-all"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </div>
  ),
)
Progress.displayName = 'Progress'
