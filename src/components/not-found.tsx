import { Link } from '@tanstack/react-router'
import { ArrowLeftCircle } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/60 bg-card/80">
        <ArrowLeftCircle className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="text-sm text-muted-foreground">
          A rota acessada não existe. Volte para o dashboard e continue navegando.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
      >
        <ArrowLeftCircle className="h-4 w-4" />
        Ir para o dashboard
      </Link>
    </div>
  )
}
