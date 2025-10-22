import { useMemo, useState } from 'react'
import { FileDown, Search } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { formatCnpj } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { useLeadsQuery } from '@/features/leads/hooks'
import { LEAD_STAGES, type Lead, type LeadStage } from '@/features/leads/types'

type StageFilter = LeadStage | 'all'

const stageOptions: Array<{ value: StageFilter; label: string }> = [
  { value: 'all', label: 'Todas etapas' },
  ...Object.entries(LEAD_STAGES).map(([stage, meta]) => ({
    value: stage as LeadStage,
    label: meta.label,
  })),
]

export function LeadsPage() {
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState<StageFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()

  const { data: leads, isLoading } = useLeadsQuery({
    search,
    stage,
  })

  const filteredLeads = leads ?? []
  const totalResults = filteredLeads.length
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex)

  const handleExport = () => {
    if (!filteredLeads.length) return

    const csv = convertLeadsToCsv(filteredLeads)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `leads-${new Date().toISOString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStageChange = (value: StageFilter) => {
    setStage(value)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(Math.max(1, Math.min(nextPage, totalPages)))
  }

  const handlePageSizeChange = (nextSize: number) => {
    setPageSize(nextSize)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1>Leads</h1>
          <p>Visualize, filtre e exporte os leads enriquecidos pela BrasilAPI.</p>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{totalResults}</span> resultados
        </div>
      </header>

      <Card className="border border-border/50 bg-card shadow-[0px_18px_60px_rgba(16,24,40,0.08)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">
            Base de leads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CNPJ, cidade..."
                  className="pl-9"
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                />
              </div>
              <Select value={stage} onValueChange={handleStageChange}>
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue placeholder="Filtrar por etapa" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={handleExport}
              disabled={!filteredLeads.length}
            >
              <FileDown className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-6 py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                Nenhum lead encontrado com os filtros atuais.
              </p>
              <p className="text-xs text-muted-foreground">
                Ajuste a busca ou limpe os filtros para visualizar novamente.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/40">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground/80">
                      <tr className="[&_th]:whitespace-nowrap">
                        <th className="px-5 py-3 text-left font-semibold">Empresa</th>
                        <th className="px-5 py-3 text-left font-semibold">CNPJ</th>
                        <th className="px-5 py-3 text-left font-semibold">Cidade/UF</th>
                        <th className="px-5 py-3 text-left font-semibold">CNAE</th>
                        <th className="px-5 py-3 text-left font-semibold">Score</th>
                        <th className="px-5 py-3 text-left font-semibold">Etapa</th>
                        <th className="px-5 py-3 text-right font-semibold">Acao</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 bg-card">
                      {paginatedLeads.map((lead, index) => {
                        const stageMeta = LEAD_STAGES[lead.stage]
                        return (
                          <tr
                            key={lead.id}
                            className={cn(
                              'transition-colors hover:bg-muted/50',
                              index % 2 === 0 ? 'bg-card' : 'bg-muted/30',
                            )}
                          >
                            <td className="px-5 py-4 font-medium text-foreground">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm leading-tight">{lead.tradeName ?? lead.legalName}</span>
                                <span className="text-xs text-muted-foreground leading-tight">{lead.legalName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                              {formatCnpj(lead.cnpj)}
                            </td>
                            <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                              {lead.city}/{lead.state}
                            </td>
                            <td className="px-5 py-4 text-xs text-muted-foreground">
                              <CnaeInfo code={lead.cnaeCode} description={lead.cnaeDescription} />
                            </td>
                            <td className="px-5 py-4">
                              <ScoreIndicator score={lead.score} />
                            </td>
                            <td className="px-5 py-4">
                              <Badge variant={stageMeta.badgeVariant} weight="medium">
                                {stageMeta.label}
                              </Badge>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-primary"
                                onClick={() =>
                                  navigate({
                                    from: '/leads',
                                    to: '/leads/$leadId',
                                    params: { leadId: lead.id },
                                  })
                                }
                              >
                                Abrir
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          totalItems={totalResults}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>
    </div>
  )
}

function ScoreIndicator({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="h-2 w-24 rounded-full bg-muted/40">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className="font-semibold text-foreground">{score}</span>
    </div>
  )
}

function CnaeInfo({
  code,
  description,
}: {
  code?: string | null
  description?: string | null
}) {
  const label = useMemo(() => {
    if (!code && !description) return '—'
    return `${code ?? ''}${description ? ` (${description})` : ''}`
  }, [code, description])

  return <span>{label}</span>
}

function convertLeadsToCsv(leads: Lead[]) {
  const safeLeads = leads ?? []

  const header = [
    'ID',
    'Razao Social',
    'Nome Fantasia',
    'CNPJ',
    'Cidade',
    'Estado',
    'CNAE',
    'Descricao CNAE',
    'E-mail',
    'Telefone',
    'Score',
    'Etapa',
  ]

  const rows = safeLeads.map((lead) => [
    lead.id,
    lead.legalName,
    lead.tradeName ?? '',
    formatCnpj(lead.cnpj),
    lead.city,
    lead.state,
    lead.cnaeCode ?? '',
    lead.cnaeDescription ?? '',
    lead.email ?? '',
    lead.phone ?? '',
    lead.score.toString(),
    LEAD_STAGES[lead.stage].label,
  ])

  const csvContent = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';'))
    .join('\n')

  return csvContent
}
