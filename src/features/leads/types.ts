import type { BankResponse } from '@/services/brasilapi'

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won'

export const LEAD_STAGES: Record<
  LeadStage,
  {
    label: string
    description: string
    badgeVariant:
      | 'default'
      | 'secondary'
      | 'outline'
      | 'success'
      | 'warning'
      | 'info'
      | 'neutral'
    pipelineOrder: number
  }
> = {
  new: {
    label: 'Novo',
    description: 'Leads recém-importados aguardando primeiro contato.',
    badgeVariant: 'neutral',
    pipelineOrder: 0,
  },
  contacted: {
    label: 'Contato Feito',
    description: 'Já receberam contato inicial.',
    badgeVariant: 'info',
    pipelineOrder: 1,
  },
  qualified: {
    label: 'Qualificado',
    description: 'Problema mapeado e interesse confirmado.',
    badgeVariant: 'success',
    pipelineOrder: 2,
  },
  proposal: {
    label: 'Proposta',
    description: 'Proposta enviada e negociação ativa.',
    badgeVariant: 'warning',
    pipelineOrder: 3,
  },
  won: {
    label: 'Ganho',
    description: 'Negócio fechado com sucesso.',
    badgeVariant: 'secondary',
    pipelineOrder: 4,
  },
}

export type Lead = {
  id: string
  legalName: string
  tradeName?: string | null
  cnpj: string
  cnaeCode?: string
  cnaeDescription?: string
  email?: string | null
  phone?: string | null
  cep?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city: string
  state: string
  bank?: Pick<BankResponse, 'code' | 'name'>
  score: number
  stage: LeadStage
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export type LeadFilters = {
  search?: string
  stage?: LeadStage | 'all'
}

export type LeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
