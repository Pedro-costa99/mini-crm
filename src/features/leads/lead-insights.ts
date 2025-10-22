import { LEAD_STAGES, type Lead, type LeadStage } from '@/features/leads/types'

export type PipelineColumn = {
  stage: LeadStage
  label: string
  description: string
  leads: Lead[]
}

export function buildPipelineColumns(leads: Lead[]): PipelineColumn[] {
  return Object.entries(LEAD_STAGES)
    .sort(([, a], [, b]) => a.pipelineOrder - b.pipelineOrder)
    .map(([key, value]) => {
      const stage = key as LeadStage
      return {
        stage,
        label: value.label,
        description: value.description,
        leads: leads
          .filter((lead) => lead.stage === stage)
          .sort((a, b) => b.score - a.score),
      }
    })
}

export function buildSummaryCards(leads: Lead[]) {
  const totalActive = leads.length
  const inProposal = leads.filter((lead) => lead.stage === 'proposal').length
  const qualified = leads.filter((lead) => lead.stage === 'qualified').length
  const wonCurrentMonth = leads.filter((lead) => {
    if (lead.stage !== 'won') return false
    const updatedAt = new Date(lead.updatedAt)
    const now = new Date()
    return (
      updatedAt.getMonth() === now.getMonth() &&
      updatedAt.getFullYear() === now.getFullYear()
    )
  }).length

  return {
    totalActive,
    inProposal,
    qualified,
    wonCurrentMonth,
  }
}

export function distributionByCity(leads: Lead[]) {
  const aggregations = leads.reduce<Record<string, { city: string; state: string; total: number }>>(
    (acc, lead) => {
      const key = `${lead.city}-${lead.state}`
      const item = acc[key] ?? { city: lead.city, state: lead.state, total: 0 }
      item.total += 1
      acc[key] = item
      return acc
    },
    {},
  )

  return Object.values(aggregations).sort((a, b) => b.total - a.total)
}

export function conversionProgress(leads: Lead[]) {
  const target = 20
  const won = leads.filter((lead) => lead.stage === 'won').length
  const percentage = Math.min(100, Math.round((won / target) * 100))

  return {
    target,
    won,
    percentage,
  }
}
