import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRealtime } from '@/hooks/use-realtime'
import { getInvoices } from '@/services/invoices'
import { getBudgetItems } from '@/services/budget-items'
import { getCategories } from '@/services/categories'
import { getStages } from '@/services/stages'
import {
  emptyFilters,
  filterInvoices,
  filterBudgetItems,
  computeSummary,
  expensesByCategory,
  expensesByStage,
  expenseEvolution,
  computeAlerts,
} from '@/lib/dashboard-utils'
import type { Invoice, BudgetItem, Category, Stage, DashboardFilters } from '@/types'

export function useDashboardData() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<DashboardFilters>(emptyFilters)

  const loadData = useCallback(async () => {
    try {
      const [invData, budgetData, catData, stageData] = await Promise.all([
        getInvoices(),
        getBudgetItems(),
        getCategories(),
        getStages(),
      ])
      setInvoices(invData)
      setBudgetItems(budgetData)
      setCategories(catData)
      setStages(stageData)
      setError(null)
    } catch {
      setError('Erro ao carregar dados do dashboard. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('invoices', () => loadData())
  useRealtime('budget_items', () => loadData())

  const filteredInvoices = useMemo(() => filterInvoices(invoices, filters), [invoices, filters])
  const filteredBudgetItems = useMemo(
    () => filterBudgetItems(budgetItems, filters),
    [budgetItems, filters],
  )

  const summary = useMemo(() => {
    const planned = filteredBudgetItems.reduce((sum, item) => sum + item.planned_value, 0)
    const executed = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    return computeSummary(planned, executed)
  }, [filteredBudgetItems, filteredInvoices])

  const categoryChartData = useMemo(() => expensesByCategory(filteredInvoices), [filteredInvoices])
  const stageChartData = useMemo(() => expensesByStage(filteredInvoices), [filteredInvoices])
  const evolutionChartData = useMemo(() => expenseEvolution(filteredInvoices), [filteredInvoices])

  const recentInvoices = useMemo(
    () =>
      [...filteredInvoices].sort((a, b) => b.issue_date.localeCompare(a.issue_date)).slice(0, 5),
    [filteredInvoices],
  )

  const pendingInvoices = useMemo(
    () =>
      filteredInvoices
        .filter((inv) => inv.payment_status === 'Pendente')
        .sort((a, b) => a.issue_date.localeCompare(b.issue_date)),
    [filteredInvoices],
  )

  const alerts = useMemo(
    () => computeAlerts(filteredInvoices, filteredBudgetItems),
    [filteredInvoices, filteredBudgetItems],
  )

  const isEmpty = invoices.length === 0 && budgetItems.length === 0
  const hasFilteredResults = filteredInvoices.length > 0 || filteredBudgetItems.length > 0

  return {
    loading,
    error,
    filters,
    setFilters,
    categories,
    stages,
    summary,
    categoryChartData,
    stageChartData,
    evolutionChartData,
    recentInvoices,
    pendingInvoices,
    categoryAlerts: alerts.categoryAlerts,
    stageAlerts: alerts.stageAlerts,
    isEmpty,
    hasFilteredResults,
    retry: loadData,
  }
}
