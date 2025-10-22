import * as React from 'react'
import { cn } from '@/lib/utils'

export type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical'
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-border/70',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  ),
)
Separator.displayName = 'Separator'
