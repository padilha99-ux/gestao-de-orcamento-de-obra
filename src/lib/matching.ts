import type { Category, Stage } from '@/types'

export function suggestCategory(text: string, categories: Category[]): string | null {
  const normalized = text.toLowerCase().trim()
  if (!normalized) return null
  for (const cat of categories) {
    if (cat.name.toLowerCase() === normalized) return cat.id
  }
  for (const cat of categories) {
    const catName = cat.name.toLowerCase()
    if (normalized.includes(catName) || catName.includes(normalized)) return cat.id
  }
  return null
}

export function suggestStage(text: string, stages: Stage[]): string | null {
  const normalized = text.toLowerCase().trim()
  if (!normalized) return null
  for (const st of stages) {
    if (st.name.toLowerCase() === normalized) return st.id
  }
  for (const st of stages) {
    const stName = st.name.toLowerCase()
    if (normalized.includes(stName) || stName.includes(normalized)) return st.id
  }
  return null
}
