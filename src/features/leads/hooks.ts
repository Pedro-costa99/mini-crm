import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'

import {
  createLead,
  listLeads,
  resetLeads,
  updateLead,
  findLeadById,
} from '@/features/leads/lead-repository'
import type { Lead, LeadFilters, LeadInput } from '@/features/leads/types'

const leadsQueryKey = ['leads'] as const
const leadQueryKey = (id: string) => ['lead', id] as const

export function useLeadsQuery(filters?: LeadFilters) {
  return useQuery({
    queryKey: [...leadsQueryKey, filters] as const,
    queryFn: () => listLeads(),
    select: (leads) => filterLeads(leads, filters),
    refetchOnMount: 'always',
    staleTime: 1_000 * 30,
  })
}

export function useCreateLeadMutation(
  options?: UseMutationOptions<Lead, Error, LeadInput>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables) => createLead(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: leadsQueryKey,
        refetchType: 'all',
      })
    },
    ...options,
  })
}

export function useUpdateLeadMutation(
  id: string,
  options?: UseMutationOptions<Lead, Error, Partial<LeadInput>>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables) => updateLead(id, variables),
    onSuccess: async (updatedLead) => {
      await queryClient.invalidateQueries({
        queryKey: leadsQueryKey,
        refetchType: 'all',
      })
      await queryClient.invalidateQueries({
        queryKey: leadQueryKey(updatedLead.id),
      })
    },
    ...options,
  })
}

export function useResetLeadsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => resetLeads(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: leadsQueryKey,
        refetchType: 'all',
      })
    },
  })
}

export function useLeadQuery(id: string | null) {
  return useQuery({
    queryKey: leadQueryKey(id ?? ''),
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) throw new Error('Lead não informado.')
      const lead = await findLeadById(id)
      if (!lead) {
        throw new Error('Lead não encontrado.')
      }
      return lead
    },
  })
}

function filterLeads(leads: Lead[], filters?: LeadFilters) {
  if (!filters) return leads

  return leads.filter((lead) => {
    let match = true

    if (filters.stage && filters.stage !== 'all') {
      match = match && lead.stage === filters.stage
    }

    if (filters.search) {
      const term = filters.search.trim().toLowerCase()
      match =
        match &&
        [
          lead.legalName,
          lead.tradeName,
          lead.cnpj,
          lead.city,
          lead.state,
          lead.cnaeCode,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term))
    }

    return match
  })
}
