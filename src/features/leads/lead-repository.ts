import type { Lead, LeadInput } from '@/features/leads/types'
import { readStorage, writeStorage } from '@/lib/storage'

const LEADS_STORAGE_KEY = '@mini-crm/leads'

type LeadStore = {
  leads: Lead[]
}

const defaultStore: LeadStore = {
  leads: [
    {
      id: 'lead-alpha-tech',
      legalName: 'Alpha Tecnologia LTDA',
      tradeName: 'Alpha Tech',
      cnpj: '12345678000190',
      cnaeCode: '6201-5/01',
      cnaeDescription: 'Desenvolvimento de programas de computador sob encomenda',
      email: 'contato@alphatech.com.br',
      phone: '11 4002-8922',
      cep: '01001000',
      street: 'Av. Paulista',
      number: '1000',
      city: 'Sao Paulo',
      state: 'SP',
      neighborhood: 'Bela Vista',
      score: 78,
      stage: 'qualified',
      notes: 'Proposta tecnica revisada e aguardando retorno do decisor.',
      createdAt: new Date('2024-09-12T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-10-01T14:30:00Z').toISOString(),
    },
    {
      id: 'lead-beta-foods',
      legalName: 'Beta Industria de Alimentos S.A.',
      tradeName: 'Beta Foods',
      cnpj: '45987321000112',
      cnaeCode: '1031-7/00',
      cnaeDescription: 'Beneficiamento de produtos alimenticios',
      email: 'compras@betafoods.com',
      phone: '51 3030-7070',
      cep: '90035972',
      street: 'Rua dos Andradas',
      number: '1550',
      city: 'Porto Alegre',
      state: 'RS',
      neighborhood: 'Centro Historico',
      score: 63,
      stage: 'proposal',
      notes: 'Proposta comercial enviada. Reuniao de follow-up agendada.',
      createdAt: new Date('2024-10-05T18:45:00Z').toISOString(),
      updatedAt: new Date('2024-10-10T12:00:00Z').toISOString(),
    },
    {
      id: 'lead-gammalog',
      legalName: 'Gamma Logistica ME',
      tradeName: 'GammaLog',
      cnpj: '07654321000155',
      cnaeCode: '4930-2/02',
      cnaeDescription: 'Transporte rodoviario de cargas intermunicipal',
      email: 'logistica@gammalog.com',
      phone: '96 3245-8899',
      cep: '68900089',
      street: 'Av. FAB',
      number: '210',
      city: 'Macapa',
      state: 'AP',
      neighborhood: 'Centro',
      score: 85,
      stage: 'contacted',
      notes: 'CS mapeou aderencia alta. Solicitar documentos para proposta.',
      createdAt: new Date('2024-09-28T08:15:00Z').toISOString(),
      updatedAt: new Date('2024-10-07T09:20:00Z').toISOString(),
    },
  ],
}

function generateLeadId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `lead-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`
}

function getStore(): LeadStore {
  return readStorage<LeadStore>(LEADS_STORAGE_KEY, defaultStore)
}

function saveStore(store: LeadStore) {
  writeStorage(LEADS_STORAGE_KEY, store)
}

function withArtificialDelay<T>(value: T, delay = 250) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), delay))
}

export async function listLeads(): Promise<Lead[]> {
  const store = getStore()
  const leads = [...store.leads].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
  return withArtificialDelay(leads)
}

export async function findLeadById(id: string) {
  const store = getStore()
  const lead = store.leads.find((item) => item.id === id) ?? null
  return withArtificialDelay(lead)
}

export async function createLead(input: LeadInput) {
  const store = getStore()
  const now = new Date().toISOString()
  const lead: Lead = {
    ...input,
    id: generateLeadId(),
    createdAt: now,
    updatedAt: now,
  }

  store.leads = [lead, ...store.leads]
  saveStore(store)

  return withArtificialDelay(lead)
}

export async function updateLead(id: string, input: Partial<LeadInput>) {
  const store = getStore()
  const index = store.leads.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Lead nao encontrado.')
  }

  const now = new Date().toISOString()
  const updatedLead: Lead = {
    ...store.leads[index],
    ...input,
    updatedAt: now,
  }

  store.leads[index] = updatedLead
  saveStore(store)

  return withArtificialDelay(updatedLead)
}

export async function resetLeads() {
  saveStore(defaultStore)
  return withArtificialDelay(defaultStore.leads)
}
