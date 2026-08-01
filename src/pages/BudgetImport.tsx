import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useBudgetImport } from '@/hooks/use-budget-import'
import { UploadStep } from '@/components/budget-import/UploadStep'
import { MappingStep } from '@/components/budget-import/MappingStep'
import { ReviewStep } from '@/components/budget-import/ReviewStep'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

function StepIndicator({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium',
        active
          ? 'bg-primary text-primary-foreground'
          : done
            ? 'bg-green-500/10 text-green-600'
            : 'bg-muted text-muted-foreground',
      )}
    >
      {label}
    </span>
  )
}

export default function BudgetImport() {
  const { canEdit } = useAuth()
  const imp = useBudgetImport()

  if (!canEdit) return <Navigate to="/" replace />

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Importar Orçamento</h1>
        <p className="text-sm text-muted-foreground">
          Importe planilhas de orçamento para o módulo de Planejamento
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <StepIndicator
          active={imp.step === 'upload'}
          done={imp.step !== 'upload'}
          label="1. Upload"
        />
        <StepIndicator
          active={imp.step === 'mapping'}
          done={imp.step === 'review' || imp.step === 'done'}
          label="2. Mapeamento"
        />
        <StepIndicator
          active={imp.step === 'review'}
          done={imp.step === 'done'}
          label="3. Revisão"
        />
        <StepIndicator active={imp.step === 'done'} done={false} label="4. Concluído" />
      </div>

      {imp.step === 'upload' && (
        <UploadStep onFile={imp.handleFile} parsing={imp.parsing} error={imp.parseError} />
      )}

      {imp.step === 'mapping' && imp.parsedData && (
        <MappingStep
          parsedData={imp.parsedData}
          mappings={imp.mappings}
          onMappingChange={(field, value) => imp.setMappings({ ...imp.mappings, [field]: value })}
          onNext={imp.proceedToReview}
          onBack={imp.goBack}
        />
      )}

      {imp.step === 'review' && (
        <ReviewStep
          rows={imp.reviewRows}
          categories={imp.categories}
          stages={imp.stages}
          onUpdate={imp.updateRow}
          onSkipToggle={imp.toggleSkip}
          onSave={imp.handleSave}
          onBack={imp.goBack}
          saving={imp.saving}
        />
      )}

      {imp.step === 'done' && imp.saveResult && (
        <Card>
          <CardContent className="flex flex-col items-center p-8">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-bold">Importação Concluída</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {imp.saveResult.saved} itens importados com sucesso · {imp.saveResult.skipped}{' '}
              ignorados · {imp.saveResult.errors} erros
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/planning">Ver Planejamento</Link>
              </Button>
              <Button variant="outline" onClick={imp.reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Nova Importação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {imp.parseError && imp.step !== 'upload' && (
        <p className="text-sm text-destructive">{imp.parseError}</p>
      )}
    </div>
  )
}
