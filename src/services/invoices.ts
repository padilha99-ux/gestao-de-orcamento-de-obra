import pb from '@/lib/pocketbase/client'
import type { Invoice } from '@/types'

export const getInvoices = async (): Promise<Invoice[]> => {
  return (await pb.collection('invoices').getFullList({
    expand: 'category,stage',
    sort: '-issue_date',
  })) as unknown as Invoice[]
}

export const createInvoice = (data: Record<string, unknown>) =>
  pb.collection('invoices').create(data)

export const updateInvoice = (id: string, data: Record<string, unknown>) =>
  pb.collection('invoices').update(id, data)

export const deleteInvoice = (id: string) => pb.collection('invoices').delete(id)
