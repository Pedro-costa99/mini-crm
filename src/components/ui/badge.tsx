import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/90 text-primary-foreground shadow',
        secondary:
          'border-transparent bg-violet-200/60 text-violet-700 shadow',
        outline: 'text-muted-foreground border-border/70',
        success: 'border-transparent bg-emerald-500/15 text-emerald-700',
        warning: 'border-transparent bg-amber-200/40 text-amber-700',
        info: 'border-transparent bg-sky-200/50 text-sky-700',
        neutral:
          'border-transparent bg-zinc-700/60 text-zinc-200',
      },
      weight: {
        normal: 'font-semibold',
        medium: 'font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
      weight: 'normal',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, weight, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, weight }), className)}
      {...props}
    />
  )
}
