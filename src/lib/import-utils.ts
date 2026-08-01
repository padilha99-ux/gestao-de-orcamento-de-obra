export function parseNumber(value: string): number {
  if (!value || typeof value !== 'string') return 0
  const cleaned = value.replace(/[R$\s]/g, '').trim()
  if (!cleaned) return 0
  if (cleaned.includes(',') && cleaned.includes('.')) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'))
  } else if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(',', '.'))
  }
  return parseFloat(cleaned) || 0
}

export function parseDate(value: string): string {
  if (!value || typeof value !== 'string') return ''
  const trimmed = value.trim()
  const brSlash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (brSlash) {
    const [, d, m, y] = brSlash
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  const brDash = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
  if (brDash) {
    const [, d, m, y] = brDash
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return trimmed
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
