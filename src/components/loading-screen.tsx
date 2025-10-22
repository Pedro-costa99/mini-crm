import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type LoadingScreenProps = {
  message?: string
  className?: string
}

export function LoadingScreen({ message, className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground',
        className,
      )}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  )
}
