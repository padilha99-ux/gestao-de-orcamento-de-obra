import { useState } from 'react'
import {
  parseBudgetFile,
  importBudgetItems,
  type ParsedData,
  type ColumnMapping,
  type ImportResult,
} from '@/services/budget-import'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export type ImportStep = 'upload' | 'mapping' | 'review'

export function useBudgetImport() {
  const [step, setStep] = useState<ImportStep>('upload')
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [mapping, setMapping] = useState<ColumnMapping>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const parseFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV. Arquivos XLSX nao sao suportados.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const text = await file.text()
      const result = await parseBudgetFile(text, file.name)
      setParsedData(result)
      setMapping({})
      setStep('mapping')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const confirmImport = async () => {
    if (!parsedData) return
    setIsImporting(true)
    setError(null)
    try {
      const result = await importBudgetItems(parsedData.rows, mapping)
      setImportResult(result)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsImporting(false)
    }
  }

  const reset = () => {
    setStep('upload')
    setParsedData(null)
    setMapping({})
    setError(null)
    setImportResult(null)
  }

  return {
    step,
    parsedData,
    mapping,
    isLoading,
    isImporting,
    error,
    importResult,
    parseFile,
    setMapping,
    confirmImport,
    reset,
    setStep,
  }
}
