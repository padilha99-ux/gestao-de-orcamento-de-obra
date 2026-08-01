import pb from '@/lib/pocketbase/client'
import type { BudgetItem } from '@/types'

export const getBudgetItems = async (): Promise<BudgetItem[]> => {
  return (await pb.collection('budget_items').getFullList({
    expand: 'category,stage',
    sort: '-planned_date',
  })) as unknown as BudgetItem[]
}

export const createBudgetItem = (data: Record<string, unknown>) =>
  pb.collection('budget_items').create(data)

export const updateBudgetItem = (id: string, data: Record<string, unknown>) =>
  pb.collection('budget_items').update(id, data)

export const deleteBudgetItem = (id: string) => pb.collection('budget_items').delete(id)
