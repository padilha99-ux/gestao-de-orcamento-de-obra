export interface Category {
  id: string
  name: string
  created: string
  updated: string
}

export interface Stage {
  id: string
  name: string
  created: string
  updated: string
}

export interface Invoice {
  id: string
  number: string
  supplier: string
  amount: number
  issue_date: string
  category: string
  stage: string
  payment_status: 'Pendente' | 'Pago'
  description: string
  observations: string
  expand?: {
    category?: Category
    stage?: Stage
  }
  created: string
  updated: string
}

export interface BudgetItem {
  id: string
  item: string
  stage: string
  planned_value: number
  category: string
  planned_date: string
  responsible: string
  expand?: {
    category?: Category
    stage?: Stage
  }
  created: string
  updated: string
}

export interface DashboardFilters {
  startDate: string
  endDate: string
  categoryId: string
  stageId: string
}

export interface DashboardSummary {
  planned: number
  executed: number
  difference: number
  variation: number
  executedPercent: number
}

export interface AlertItem {
  name: string
  planned: number
  executed: number
  exceeded: number
}
