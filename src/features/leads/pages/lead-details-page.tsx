import { ArrowLeft, Building2, Globe, MapPin, ScrollText } from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCep, formatCnpj, formatPhone } from '@/lib/formatters'
import { LEAD_STAGES } from '@/features/leads/types'
import { useLeadQuery } from '@/features/leads/hooks'

export function LeadDetailsPage() {
  const navigate = useNavigate()
  const { leadId } = useParams({ from: '/protected/leads/$leadId' })

  const { data: lead, isLoading, error } = useLeadQuery(leadId)

  const handleBack = () => {
    void navigate({ to: '/leads' })
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="gap-2 px-0 text-muted-foreground" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para leads
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Detalhes do lead</h1>
          <p>Consulte informacoes enriquecidas pela BrasilAPI para prosseguir com a negociacao.</p>
        </div>
        {lead ? (
          <Badge variant={LEAD_STAGES[lead.stage].badgeVariant} weight="medium">
            {LEAD_STAGES[lead.stage].label}
          </Badge>
        ) : null}
      </header>

      {isLoading ? (
        <DetailsSkeleton />
      ) : error ? (
        <Card className="border border-border/60 bg-card/80">
          <CardContent className="flex flex-col gap-3 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">Lead nao encontrado</h2>
            <p className="text-sm text-muted-foreground">
              Talvez ele tenha sido removido ou nao exista mais. Volte para a lista e tente novamente.
            </p>
            <Button onClick={handleBack} className="mx-auto mt-2 w-fit">
              Voltar para lista
            </Button>
          </CardContent>
        </Card>
      ) : lead ? (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="border border-border/60 bg-card/80">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Building2 className="h-5 w-5 text-primary" />
                  {lead.tradeName ?? lead.legalName}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {lead.legalName} · CNPJ {formatCnpj(lead.cnpj)}
                </p>
              </div>
              <Badge variant={LEAD_STAGES[lead.stage].badgeVariant} weight="medium">
                {LEAD_STAGES[lead.stage].label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="grid gap-4 md:grid-cols-2">
                <InfoBlock label="CNAE" value={lead.cnaeCode ?? '—'} />
                <InfoBlock label="Descricao CNAE" value={lead.cnaeDescription ?? '—'} />
                <InfoBlock label="E-mail" value={lead.email ?? '—'} />
                <InfoBlock label="Telefone" value={formatPhone(lead.phone)} />
              </section>

              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Localizacao
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoBlock label="CEP" value={formatCep(lead.cep)} />
                  <InfoBlock label="Cidade/UF" value={`${lead.city}/${lead.state}`} />
                  <InfoBlock
                    label="Endereco"
                    value={[lead.street, lead.number].filter(Boolean).join(', ') || '—'}
                  />
                  <InfoBlock label="Bairro" value={lead.neighborhood ?? '—'} />
                  <InfoBlock label="Complemento" value={lead.complement ?? '—'} />
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Globe className="h-4 w-4 text-primary" />
                  Informacoes comerciais
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoBlock label="Banco" value={lead.bank ? `${lead.bank.code} - ${lead.bank.name}` : '—'} />
                  <InfoBlock label="Score" value={`${lead.score} pontos`} />
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ScrollText className="h-4 w-4 text-primary" />
                  Notas internas
                </h2>
                <p className="rounded-xl border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
                  {lead.notes?.trim() ? lead.notes : 'Sem anotacoes registradas.'}
                </p>
              </section>

              <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <span>
                  Criado em {new Date(lead.createdAt).toLocaleDateString('pt-BR')} · Atualizado em{' '}
                  {new Date(lead.updatedAt).toLocaleDateString('pt-BR')}
                </span>
                <Button variant="outline" size="sm" disabled className="text-xs text-muted-foreground">
                  Em breve: editar lead
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">Proximos passos sugeridos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Utilize os dados enriquecidos para planejar o follow-up.</p>
              <ul className="space-y-3">
                <li>
                  <strong className="text-foreground">1. </strong>Confirme o telefone e valide o decisor.
                </li>
                <li>
                  <strong className="text-foreground">2. </strong>Verifique pendencias no CNAE ou possiveis sinergias.
                </li>
                <li>
                  <strong className="text-foreground">3. </strong>Registre qual banco atende a empresa para ofertas financeiras.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}

type InfoBlockProps = {
  label: string
  value: string
}

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Skeleton className="h-[520px] rounded-2xl" />
      <Skeleton className="h-[320px] rounded-2xl" />
    </div>
  )
}
