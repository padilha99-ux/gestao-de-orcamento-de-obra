import pb from '@/lib/pocketbase/client'
import type { Stage } from '@/types'

export const getStages = async (): Promise<Stage[]> => {
  return (await pb.collection('stages').getFullList({
    sort: 'name',
  })) as unknown as Stage[]
}

export const createStage = (name: string) => pb.collection('stages').create({ name })

export const updateStage = (id: string, name: string) =>
  pb.collection('stages').update(id, { name })

export const deleteStage = (id: string) => pb.collection('stages').delete(id)
