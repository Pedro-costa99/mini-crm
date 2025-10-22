import { Outlet } from '@tanstack/react-router'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/auth-provider'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Leads', to: '/leads' },
  { label: 'Novo Lead', to: '/leads/novo' },
]

export function AppLayout() {
  const { state, logout } = useAuth()
  const [isNavOpen, setIsNavOpen] = useState(false)

  const initials = state.status === 'authenticated' ? getInitials(state.user.name) : 'CRM'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-sidebar-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-lg font-semibold text-primary shadow-sm">
                CRM
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Mini CRM — BrasilAPI
                </p>
                <p className="text-xs text-muted-foreground">Prospecção B2B mockada</p>
              </div>
            </div>
            <nav className="hidden items-center gap-1 rounded-full border border-border/50 bg-card/60 p-1 text-sm font-medium md:flex">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} label={item.label} />
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-border/50 p-2 text-muted-foreground md:hidden"
              onClick={() => setIsNavOpen((value) => !value)}
              aria-label="Abrir navegação"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {state.status === 'authenticated' ? state.user.name : 'Convidado'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {state.status === 'authenticated' ? state.user.email : 'Sem sessão'}
                </p>
              </div>
              <Avatar className="h-10 w-10 border border-border/70">
                {state.status === 'authenticated' && state.user.avatarUrl ? (
                  <AvatarImage src={state.user.avatarUrl} alt={`${state.user.name} avatar`} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 border border-border/50"
                onClick={() => {
                  void logout()
                }}
                title="Encerrar sessão"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {isNavOpen ? (
          <div className="border-t border-border/50 bg-card/90 px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  onNavigate={() => setIsNavOpen(false)}
                />
              ))}
              <Button
                variant="ghost"
                className="justify-start text-sm text-muted-foreground"
                onClick={() => {
                  void logout()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}

type NavLinkProps = {
  to: string
  label: string
  onNavigate?: () => void
}

function NavLink({ to, label, onNavigate }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
      activeProps={{
        className: cn(
          'bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground',
        ),
      }}
      activeOptions={{ exact: true }}
      onClick={onNavigate}
    >
      {label}
    </Link>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
