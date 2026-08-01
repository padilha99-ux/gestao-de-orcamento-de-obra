import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadStepProps {
  onFile: (file: File) => void
  parsing: boolean
  error: string
}

export function UploadStep({ onFile, parsing, error }: UploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'xlsx' && ext !== 'csv') return
    onFile(file)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files[0])
          }}
        >
          {parsing ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Processando arquivo...</p>
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-sm font-medium">
                Arraste uma planilha ou clique para selecionar
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Formatos aceitos: .xlsx, .csv</p>
              <Button className="mt-4" onClick={() => inputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Selecionar Arquivo
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </>
          )}
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
