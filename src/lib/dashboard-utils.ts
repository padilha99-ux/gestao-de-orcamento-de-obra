import type { Invoice, BudgetItem, DashboardFilters, DashboardSummary, AlertItem } from '@/types'

export const emptyFilters: DashboardFilters = {
  startDate: '',
  endDate: '',
  categoryId: 'all',
  stageId: 'all',
}

export function hasActiveFilters(filters: DashboardFilters): boolean {
  return (
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.categoryId !== 'all' ||
    filters.stageId !== 'all'
  )
}

export function filterInvoices(invoices: Invoice[], filters: DashboardFilters): Invoice[] {
  return invoices.filter((inv) => {
    if (filters.startDate && inv.issue_date < filters.startDate) return false
    if (filters.endDate && inv.issue_date > filters.endDate) return false
    if (filters.categoryId !== 'all' && inv.category !== filters.categoryId) return false
    if (filters.stageId !== 'all' && inv.stage !== filters.stageId) return false
    return true
  })
}

export function filterBudgetItems(items: BudgetItem[], filters: DashboardFilters): BudgetItem[] {
  return items.filter((item) => {
    if (filters.startDate && item.planned_date < filters.startDate) return false
    if (filters.endDate && item.planned_date > filters.endDate) return false
    if (filters.categoryId !== 'all' && item.category !== filters.categoryId) return false
    if (filters.stageId !== 'all' && item.stage !== filters.stageId) return false
    return true
  })
}

export function computeSummary(planned: number, executed: number): DashboardSummary {
  const difference = planned - executed
  const variation = planned > 0 ? ((executed - planned) / planned) * 100 : 0
  const executedPercent = planned > 0 ? (executed / planned) * 100 : 0
  return { planned, executed, difference, variation, executedPercent }
}

export function expensesByCategory(invoices: Invoice[]): { name: string; value: number }[] {
  const map = new Map<string, { name: string; value: number }>()
  for (const inv of invoices) {
    const name = inv.expand?.category?.name || 'Sem categoria'
    const existing = map.get(inv.category) || { name, value: 0 }
    existing.value += inv.amount
    map.set(inv.category, existing)
  }
  return Array.from(map.values()).sort((a, b) => b.value - a.value)
}

export function expensesByStage(invoices: Invoice[]): { name: string; value: number }[] {
  const map = new Map<string, { name: string; value: number }>()
  for (const inv of invoices) {
    const name = inv.expand?.stage?.name || 'Sem etapa'
    const existing = map.get(inv.stage) || { name, value: 0 }
    existing.value += inv.amount
    map.set(inv.stage, existing)
  }
  return Array.from(map.values()).sort((a, b) => b.value - a.value)
}

export function expenseEvolution(invoices: Invoice[]): { month: string; value: number }[] {
  const map = new Map<string, { sortKey: string; value: number }>()
  for (const inv of invoices) {
    const date = new Date(inv.issue_date + 'T00:00:00')
    const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    })
    const existing = map.get(sortKey) || { sortKey, value: 0 }
    existing.value += inv.amount
    map.set(sortKey, existing)
    map.set(sortKey, { ...existing, sortKey: label })
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ month: v.sortKey, value: v.value }))
}

export function computeAlerts(
  invoices: Invoice[],
  budgetItems: BudgetItem[],
): { categoryAlerts: AlertItem[]; stageAlerts: AlertItem[] } {
  const plannedByCategory = new Map<string, { name: string; value: number }>()
  const executedByCategory = new Map<string, { name: string; value: number }>()
  const plannedByStage = new Map<string, { name: string; value: number }>()
  const executedByStage = new Map<string, { name: string; value: number }>()

  for (const item of budgetItems) {
    const catName = item.expand?.category?.name || 'Sem categoria'
    const stageName = item.expand?.stage?.name || 'Sem etapa'
    const cat = plannedByCategory.get(item.category) || { name: catName, value: 0 }
    cat.value += item.planned_value
    plannedByCategory.set(item.category, cat)
    const stg = plannedByStage.get(item.stage) || { name: stageName, value: 0 }
    stg.value += item.planned_value
    plannedByStage.set(item.stage, stg)
  }

  for (const inv of invoices) {
    const catName = inv.expand?.category?.name || 'Sem categoria'
    const stageName = inv.expand?.stage?.name || 'Sem etapa'
    const cat = executedByCategory.get(inv.category) || { name: catName, value: 0 }
    cat.value += inv.amount
    executedByCategory.set(inv.category, cat)
    const stg = executedByStage.get(inv.stage) || { name: stageName, value: 0 }
    stg.value += inv.amount
    executedByStage.set(inv.stage, stg)
  }

  const categoryAlerts: AlertItem[] = []
  for (const [id, planned] of plannedByCategory) {
    const executed = executedByCategory.get(id)
    if (executed && executed.value > planned.value) {
      categoryAlerts.push({
        name: planned.name,
        planned: planned.value,
        executed: executed.value,
        exceeded: executed.value - planned.value,
      })
    }
  }

  const stageAlerts: AlertItem[] = []
  for (const [id, planned] of plannedByStage) {
    const executed = executedByStage.get(id)
    if (executed && executed.value > planned.value) {
      stageAlerts.push({
        name: planned.name,
        planned: planned.value,
        executed: executed.value,
        exceeded: executed.value - planned.value,
      })
    }
  }

  return { categoryAlerts, stageAlerts }
}
