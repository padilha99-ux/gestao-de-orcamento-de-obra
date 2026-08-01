import pb from '@/lib/pocketbase/client'
import type { Category } from '@/types'

export const getCategories = async (): Promise<Category[]> => {
  return (await pb.collection('categories').getFullList({
    sort: 'name',
  })) as unknown as Category[]
}

export const createCategory = (name: string) => pb.collection('categories').create({ name })

export const updateCategory = (id: string, name: string) =>
  pb.collection('categories').update(id, { name })

export const deleteCategory = (id: string) => pb.collection('categories').delete(id)
