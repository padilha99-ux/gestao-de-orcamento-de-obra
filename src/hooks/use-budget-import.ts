import { useState, useCallback } from 'react'
import {
  parseBudgetFile,
  saveImportedItems,
  type ParsedSpreadsheet,
  type ColumnMappings,
  type ReviewRow,
  type SaveResult,
} from '@/services/budget-import'
import { getBudgetItems } from '@/services/budget-items'
import { getCategories } from '@/services/categories'
import { getStages } from '@/services/stages'
import { transformRows, validateRow } from '@/lib/import-utils'
import type { Category, Stage } from '@/types'

type Step = 'upload' | 'mapping' | 'review' | 'done'

const emptyMappings: ColumnMappings = {
  item: '',
  planned_value: '',
  planned_date: '',
  responsible: '',
  category: '',
  stage: '',
}

export function useBudgetImport() {
  const [step, setStep] = useState<Step>('upload')
  const [parsedData, setParsedData] = useState<ParsedSpreadsheet | null>(null)
  const [mappings, setMappings] = useState<ColumnMappings>(emptyMappings)
  const [reviewRows, setReviewRows] = useState<ReviewRow[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setParsing(true)
    setParseError('')
    try {
      const data = await parseBudgetFile(file)
      setParsedData(data)
      setStep('mapping')
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Erro ao processar arquivo')
    } finally {
      setParsing(false)
    }
  }, [])

  const proceedToReview = useCallback(async () => {
    if (!parsedData) return
    setParseError('')
    try {
      const [existingItems, cats, sts] = await Promise.all([
        getBudgetItems(),
        getCategories(),
        getStages(),
      ])
      setCategories(cats)
      setStages(sts)
      const rows = transformRows(parsedData.rows, mappings, cats, sts, existingItems)
      setReviewRows(rows.map((r) => ({ ...r, errors: validateRow(r) })))
      setStep('review')
    } catch {
      setParseError('Erro ao carregar dados para revisão')
    }
  }, [parsedData, mappings])

  const updateRow = useCallback((index: number, field: string, value: string) => {
    setReviewRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      if (field === 'category') next[index].categoryMatched = true
      if (field === 'stage') next[index].stageMatched = true
      next[index].errors = validateRow(next[index])
      return next
    })
  }, [])

  const toggleSkip = useCallback((index: number) => {
    setReviewRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], skipped: !next[index].skipped }
      return next
    })
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setParseError('')
    try {
      const result = await saveImportedItems(reviewRows)
      setSaveResult(result)
      setStep('done')
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Erro ao salvar itens')
    } finally {
      setSaving(false)
    }
  }, [reviewRows])

  const goBack = useCallback(() => {
    if (step === 'review') setStep('mapping')
    else if (step === 'mapping') setStep('upload')
  }, [step])

  const reset = useCallback(() => {
    setStep('upload')
    setParsedData(null)
    setReviewRows([])
    setSaveResult(null)
    setParseError('')
    setMappings(emptyMappings)
  }, [])

  return {
    step,
    parsedData,
    mappings,
    setMappings,
    reviewRows,
    categories,
    stages,
    parsing,
    parseError,
    saving,
    saveResult,
    handleFile,
    proceedToReview,
    updateRow,
    toggleSkip,
    handleSave,
    goBack,
    reset,
  }
}
