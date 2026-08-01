import pb from '@/lib/pocketbase/client'
import { createBudgetItem } from '@/services/budget-items'
import type { BudgetItem } from '@/types'

export interface ParsedSpreadsheet {
  headers: string[]
  rows: Record<string, string>[]
  sheetNames: string[]
}

export interface ColumnMappings {
  item: string
  planned_value: string
  planned_date: string
  responsible: string
  category: string
  stage: string
}

export interface ReviewRow {
  item: string
  planned_value: string
  planned_date: string
  responsible: string
  category: string
  stage: string
  categoryMatched: boolean
  stageMatched: boolean
  isDuplicate: boolean
  skipped: boolean
  errors: Record<string, string>
}

export interface SaveResult {
  saved: number
  skipped: number
  errors: number
}

export async function parseBudgetFile(file: File): Promise<ParsedSpreadsheet> {
  const base64 = await fileToBase64(file)
  return pb.send('/backend/v1/budget-import/parse', {
    method: 'POST',
    body: JSON.stringify({ content: base64, filename: file.name }),
    headers: { 'Content-Type': 'application/json' },
  }) as Promise<ParsedSpreadsheet>
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function isDuplicateRow(row: ReviewRow, existing: BudgetItem[]): boolean {
  const value = parseFloat(row.planned_value) || 0
  return existing.some(
    (e) =>
      e.item === row.item &&
      e.planned_value === value &&
      e.planned_date === row.planned_date &&
      e.category === row.category &&
      e.stage === row.stage,
  )
}

export async function saveImportedItems(rows: ReviewRow[]): Promise<SaveResult> {
  const validRows = rows.filter(
    (r) => !r.skipped && !r.isDuplicate && Object.keys(r.errors).length === 0,
  )
  const results = await Promise.allSettled(
    validRows.map((row) =>
      createBudgetItem({
        item: row.item.trim(),
        stage: row.stage,
        planned_value: parseFloat(row.planned_value) || 0,
        category: row.category,
        planned_date: row.planned_date,
        responsible: row.responsible.trim(),
      }),
    ),
  )
  const saved = results.filter((r) => r.status === 'fulfilled').length
  const errors = results.filter((r) => r.status === 'rejected').length
  return { saved, skipped: rows.length - validRows.length, errors }
}
