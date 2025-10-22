import { Outlet } from '@tanstack/react-router'
import { Github } from 'lucide-react'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/60">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card/90 shadow-2xl shadow-primary/10">
          <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
            <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary/30 via-primary/20 to-background px-10 py-12 text-left md:flex">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-lg font-semibold text-primary-foreground">
                  CRM
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    Mini CRM BrasilAPI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pipeline de prospecção com dados enriquecidos
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-3xl font-semibold text-foreground">
                  Cadastre leads com dados oficiais da BrasilAPI.
                </h1>
                <p className="text-sm text-muted-foreground">
                  Utilize o CNPJ ou CEP para preencher automaticamente razão social, CNAE,
                  endereço e mais detalhes para agilizar suas cadências.
                </p>
              </div>
              <footer className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-4 w-4" />
                Projeto demo - Stack React 19 + TanStack Router/Query + Tailwind.
              </footer>
            </div>
            <div className="relative bg-card px-6 py-10 md:px-10">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
