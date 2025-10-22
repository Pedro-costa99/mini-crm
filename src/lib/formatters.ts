export function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
    '$1.$2.$3/$4-$5',
  )
}

export function formatCep(value?: string | null) {
  if (!value) return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 8) return value
  return digits.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export function formatPhone(value?: string | null) {
  if (!value) return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return value
}
