import { brasilAPI } from '@/lib/http'

export type CnpjResponse = {
  cnpj: string
  razao_social: string
  nome_fantasia: string | null
  descricao_matriz_filial: string
  cnae_fiscal: number
  cnae_fiscal_descricao: string
  cep: string
  municipio: string
  uf: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  ddd_telefone_1: string | null
  email: string | null
  capital_social: number
}

export type CepResponse = {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  service: string
}

export type BankResponse = {
  name: string
  code: number
  fullName: string
  ispb: string
}

export async function fetchCompanyByCNPJ(cnpj: string) {
  const sanitized = cnpj.replace(/\D/g, '')
  if (sanitized.length !== 14) {
    throw new Error('Informe um CNPJ válido com 14 dígitos.')
  }
  const { data } = await brasilAPI.get<CnpjResponse>(`/cnpj/v1/${sanitized}`)
  return data
}

export async function fetchAddressByCEP(cep: string) {
  const sanitized = cep.replace(/\D/g, '')
  if (sanitized.length !== 8) {
    throw new Error('Informe um CEP válido com 8 dígitos.')
  }
  const { data } = await brasilAPI.get<CepResponse>(`/cep/v2/${sanitized}`)
  return data
}

export async function fetchBanks() {
  const { data } = await brasilAPI.get<BankResponse[]>('/banks/v1')
  return data
}
