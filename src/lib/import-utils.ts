import type { BudgetItem, Category, Stage } from '@/types'
import { suggestCategory, suggestStage } from '@/lib/matching'
import type { ColumnMappings, ReviewRow } from '@/services/budget-import'

export function normalizeDate(dateStr: string): string {
  if (!dateStr) return ''
  const brMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  const dashMatch = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (dashMatch) return `${dashMatch[3]}-${dashMatch[2]}-${dashMatch[1]}`
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  return ''
}

export function parseValue(val: string): number {
  const cleaned = (val || '').replace(/[R$\s]/g, '')
  if (!cleaned) return 0
  if (cleaned.includes('.') && cleaned.includes(',')) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'))
  }
  if (cleaned.includes(',')) return parseFloat(cleaned.replace(',', '.'))
  return parseFloat(cleaned)
}

export function transformRows(
  parsedRows: Record<string, string>[],
  mappings: ColumnMappings,
  categories: Category[],
  stages: Stage[],
  existingItems: BudgetItem[],
): ReviewRow[] {
  return parsedRows.map((row) => {
    const itemName = (row[mappings.item] || '').trim()
    const categorySource = mappings.category ? row[mappings.category] : itemName
    const stageSource = mappings.stage ? row[mappings.stage] : itemName
    const category = suggestCategory(categorySource, categories)
    const stage = suggestStage(stageSource, stages)
    const value = parseValue(row[mappings.planned_value] || '')

    const reviewRow: ReviewRow = {
      item: itemName,
      planned_value: isNaN(value) ? '' : String(value),
      planned_date: normalizeDate(row[mappings.planned_date] || ''),
      responsible: (row[mappings.responsible] || '').trim(),
      category: category || '',
      stage: stage || '',
      categoryMatched: !!category,
      stageMatched: !!stage,
      isDuplicate: false,
      skipped: false,
      errors: {},
    }

    reviewRow.isDuplicate = existingItems.some(
      (e) =>
        e.item === reviewRow.item &&
        e.planned_value === value &&
        e.planned_date === reviewRow.planned_date &&
        e.category === reviewRow.category &&
        e.stage === reviewRow.stage,
    )

    return reviewRow
  })
}

export function validateRow(row: ReviewRow): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!row.item.trim()) errors.item = 'Obrigatório'
  const value = parseFloat(row.planned_value)
  if (isNaN(value) || value <= 0) errors.planned_value = 'Valor inválido'
  if (!row.planned_date) errors.planned_date = 'Obrigatório'
  if (!row.responsible.trim()) errors.responsible = 'Obrigatório'
  if (!row.category) errors.category = 'Selecione'
  if (!row.stage) errors.stage = 'Selecione'
  return errors
}
