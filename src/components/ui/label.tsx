import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    hint?: string
  }
>(({ className, hint, ...props }, ref) => (
  <div className="space-y-1">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none text-muted-foreground',
        props['aria-disabled'] && 'cursor-not-allowed opacity-70',
        className,
      )}
      {...props}
    />
    {hint ? <span className="text-xs text-muted-foreground/70">{hint}</span> : null}
  </div>
))
Label.displayName = LabelPrimitive.Root.displayName
