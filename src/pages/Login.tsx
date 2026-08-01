import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ClientResponseError } from 'pocketbase'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Building2, Loader2, AlertCircle, User, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { signIn, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isAuthenticated) return <Navigate to="/" replace />

  const validateEmail = (value: string) => {
    if (!value) return 'E-mail é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailErr = validateEmail(email)
    setEmailError(emailErr)
    if (emailErr) return
    if (!password) {
      setError('Senha é obrigatória')
      return
    }
    setError('')
    setSubmitting(true)
    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      if (signInError instanceof ClientResponseError && signInError.status === 0) {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.')
      } else {
        setError(getErrorMessage(signInError))
      }
      setSubmitting(false)
    } else {
      navigate('/')
    }
  }

  const fillCredentials = (em: string, pw: string) => {
    setEmail(em)
    setPassword(pw)
    setEmailError('')
    setError('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Gestão de Orçamento de Obra</CardTitle>
            <CardDescription>Acesse o sistema para gerenciar seu orçamento</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  placeholder="seu@email.com"
                  required
                />
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Credenciais de Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Administrador</p>
                <p className="text-xs text-muted-foreground">padilha99@hotmail.com</p>
                <p className="text-xs text-muted-foreground">Senha: Skip@Pass</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillCredentials('padilha99@hotmail.com', 'Skip@Pass')}
              >
                Usar
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Consultor</p>
                <p className="text-xs text-muted-foreground">consultor@example.com</p>
                <p className="text-xs text-muted-foreground">Senha: Skip@Pass</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillCredentials('consultor@example.com', 'Skip@Pass')}
              >
                Usar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
