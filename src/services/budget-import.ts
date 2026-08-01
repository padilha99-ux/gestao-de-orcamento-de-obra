import pb from '@/lib/pocketbase/client'
import { parseNumber, parseDate } from '@/lib/import-utils'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export interface ParsedData {
  headers: string[]
  rows: Record<string, string>[]
  sheetNames: string[]
}

export interface ColumnMapping {
  item?: string
  stage?: string
  planned_value?: string
  category?: string
  planned_date?: string
  responsible?: string
}

export interface ImportResult {
  created: number
  errors: string[]
}

export async function parseBudgetFile(content: string, filename: string): Promise<ParsedData> {
  return pb.send('/backend/v1/budget-import/parse', {
    method: 'POST',
    body: JSON.stringify({ content, filename }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function importBudgetItems(
  rows: Record<string, string>[],
  mapping: ColumnMapping,
): Promise<ImportResult> {
  const stages = await pb.collection('stages').getFullList()
  const categories = await pb.collection('categories').getFullList()

  const stageMap = new Map<string, string>()
  stages.forEach((s) => stageMap.set(String(s.name).toLowerCase(), s.id))

  const categoryMap = new Map<string, string>()
  categories.forEach((c) => categoryMap.set(String(c.name).toLowerCase(), c.id))

  let created = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    try {
      const row = rows[i]

      const stageName = mapping.stage ? (row[mapping.stage] || '').trim() : ''
      let stageId = stageMap.get(stageName.toLowerCase())
      if (!stageId && stageName) {
        const newStage = await pb.collection('stages').create({ name: stageName })
        stageMap.set(stageName.toLowerCase(), newStage.id)
        stageId = newStage.id
      }

      const categoryName = mapping.category ? (row[mapping.category] || '').trim() : ''
      let categoryId = categoryMap.get(categoryName.toLowerCase())
      if (!categoryId && categoryName) {
        const newCat = await pb.collection('categories').create({ name: categoryName })
        categoryMap.set(categoryName.toLowerCase(), newCat.id)
        categoryId = newCat.id
      }

      const item = mapping.item ? (row[mapping.item] || '').trim() : ''
      if (!item) {
        errors.push(`Linha ${i + 2}: Item nao especificado`)
        continue
      }

      const plannedValue = mapping.planned_value ? parseNumber(row[mapping.planned_value]) : 0
      const plannedDate = mapping.planned_date ? parseDate(row[mapping.planned_date]) : ''
      const responsible = mapping.responsible ? (row[mapping.responsible] || '').trim() : ''

      const data: Record<string, unknown> = {
        item,
        planned_value: plannedValue,
        responsible,
      }
      if (stageId) data.stage = stageId
      if (categoryId) data.category = categoryId
      if (plannedDate) data.planned_date = plannedDate

      await pb.collection('budget_items').create(data)
      created++
    } catch (err) {
      errors.push(`Linha ${i + 2}: ${getErrorMessage(err)}`)
    }
  }

  return { created, errors }
}
