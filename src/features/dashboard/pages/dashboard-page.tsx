import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowUpRight, Briefcase, ChartBarBig, Target } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  buildPipelineColumns,
  buildSummaryCards,
  conversionProgress,
  distributionByCity,
} from '@/features/leads/lead-insights'
import { LEAD_STAGES } from '@/features/leads/types'
import { useLeadsQuery } from '@/features/leads/hooks'

const SUMMARY_CARDS = [
  {
    key: 'totalActive',
    title: 'Leads ativos',
    icon: Briefcase,
    description: 'Total no funil',
  },
  {
    key: 'inProposal',
    title: 'Em Proposta',
    icon: ChartBarBig,
    description: 'Etapa atual',
  },
  {
    key: 'qualified',
    title: 'Qualificados',
    icon: ArrowUpRight,
    description: 'Prontos para proposta',
  },
  {
    key: 'wonCurrentMonth',
    title: 'Ganhos (Mês)',
    icon: Target,
    description: 'Oportunidades fechadas',
  },
] as const

export function DashboardPage() {
  const { data: leads, isLoading } = useLeadsQuery()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  const safeLeads = leads ?? []
  const summary = buildSummaryCards(safeLeads)
  const pipeline = buildPipelineColumns(safeLeads)
  const cities = distributionByCity(safeLeads)
  const conversion = conversionProgress(safeLeads)

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>Dashboard</h1>
        <p>Métricas em tempo real com base nos leads mockados do funil.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_CARDS.map((card) => {
          const Icon = card.icon
          const value = summary[card.key]

          return (
            <Card key={card.key} className="border border-border/60 bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-muted/50 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">{value}</div>
                <p className="text-xs text-muted-foreground/80">{card.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pipeline (Kanban compacto)</h2>
          <p className="text-xs text-muted-foreground">
            Priorize cards com maior score primeiro.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pipeline.map((column) => {
            const stageMeta = LEAD_STAGES[column.stage]
            return (
              <Card key={column.stage} className="border border-border/60 bg-card/80">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-foreground">{column.label}</CardTitle>
                    <Badge variant={stageMeta.badgeVariant} weight="medium">
                      {column.leads.length}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{stageMeta.description}</p>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-4">
                  {column.leads.length === 0 ? (
                    <p className="text-xs text-muted-foreground/80">Sem leads nesta etapa.</p>
                  ) : (
                    column.leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-border/50 bg-muted/40 px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {lead.tradeName ?? lead.legalName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.city}/{lead.state}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Score</span>
                          <span className="font-semibold text-foreground">{lead.score}</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Distribuição por cidade</CardTitle>
            <p className="text-xs text-muted-foreground">
              Onde estão concentradas as empresas do funil atual.
            </p>
          </CardHeader>
          <CardContent className="h-64">
            {cities.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sem dados para exibir.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cities.map((city) => ({
                    name: `${city.city}/${city.state}`,
                    value: city.total,
                  }))}
                  margin={{ top: 8, left: 12, right: 16, bottom: 8 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const item = payload[0]
                      return (
                        <div className="rounded-lg border border-border/60 bg-card px-3 py-2 text-xs text-foreground shadow">
                          <p className="font-semibold">{item.payload.name}</p>
                          <p className="text-muted-foreground">
                            {item.value} {item.value === 1 ? 'lead' : 'leads'}
                          </p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Conversão estimada</CardTitle>
            <p className="text-xs text-muted-foreground">
              Progresso em relação à meta de oportunidades ganhas no mês.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Meta mensal</span>
                <span>{conversion.target} oportunidades</span>
              </div>
              <Progress value={conversion.percentage} className="mt-2 h-3" />
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">
                {conversion.percentage}% da meta alcançada
              </p>
              <p className="text-xs text-muted-foreground">
                {conversion.won} de {conversion.target} oportunidades ganhas.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
