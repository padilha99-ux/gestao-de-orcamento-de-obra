import { useBudgetImport } from '@/hooks/use-budget-import'
import { UploadStep } from '@/components/budget-import/UploadStep'
import { MappingStep } from '@/components/budget-import/MappingStep'
import { ReviewStep } from '@/components/budget-import/ReviewStep'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BudgetImport() {
  const {
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
  } = useBudgetImport()

  if (importResult) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Importacao Concluida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-lg font-medium">
                {importResult.created} itens criados com sucesso
              </span>
            </div>
            {importResult.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {importResult.errors.length} erro(s) encontrado(s):
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto rounded-md bg-muted/50 p-3 text-xs space-y-1">
                  {importResult.errors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={reset}>Nova Importacao</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Importar Orcamento</h1>
        <p className="text-muted-foreground">Faca upload de itens orcamentarios via arquivo CSV</p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-2">
        <StepIndicator num={1} label="Upload" active={step === 'upload'} done={step !== 'upload'} />
        <div className="h-px w-12 bg-border" />
        <StepIndicator
          num={2}
          label="Mapeamento"
          active={step === 'mapping'}
          done={step === 'review'}
        />
        <div className="h-px w-12 bg-border" />
        <StepIndicator num={3} label="Revisao" active={step === 'review'} done={false} />
      </div>

      {step === 'upload' && (
        <UploadStep onFileParsed={parseFile} isLoading={isLoading} error={error} />
      )}
      {step === 'mapping' && parsedData && (
        <MappingStep
          headers={parsedData.headers}
          mapping={mapping}
          onMappingChange={setMapping}
          onBack={reset}
          onNext={() => setStep('review')}
        />
      )}
      {step === 'review' && parsedData && (
        <ReviewStep
          rows={parsedData.rows}
          mapping={mapping}
          onBack={() => setStep('mapping')}
          onConfirm={confirmImport}
          isLoading={isImporting}
          error={error}
        />
      )}
    </div>
  )
}

function StepIndicator({
  num,
  label,
  active,
  done,
}: {
  num: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
          active
            ? 'bg-primary text-primary-foreground'
            : done
              ? 'bg-green-600 text-white'
              : 'bg-muted text-muted-foreground',
        )}
      >
        {done ? '\u2713' : num}
      </div>
      <span
        className={cn('text-xs', active ? 'font-medium text-foreground' : 'text-muted-foreground')}
      >
        {label}
      </span>
    </div>
  )
}
