import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface UploadStepProps {
  onFileParsed: (file: File) => void
  isLoading: boolean
  error: string | null
}

export function UploadStep({ onFileParsed, isLoading, error }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      onFileParsed(file)
    },
    [onFileParsed],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Importar Orcamento</CardTitle>
        <CardDescription>Faca upload de um arquivo CSV com os itens do orcamento.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragging(false)
          }}
          onClick={() => !isLoading && inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processando arquivo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                Arraste um arquivo CSV aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">Apenas arquivos .csv sao suportados</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-md bg-muted/50 p-4">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Formato esperado do CSV:</p>
              <p>Colunas: Item, Etapa, Valor Planejado, Categoria, Data Planejada, Responsavel</p>
              <p>Delimitadores suportados: virgula, ponto e virgula ou tabulacao</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
