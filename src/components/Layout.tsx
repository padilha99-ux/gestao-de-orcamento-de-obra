import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Building2,
  LogOut,
  Menu,
  LayoutDashboard,
  Receipt,
  CalendarCheck,
  FileBarChart,
  Settings,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invoices', label: 'Notas Fiscais', icon: Receipt },
  { to: '/planning', label: 'Planejamento', icon: CalendarCheck },
  { to: '/reports', label: 'Relatórios', icon: FileBarChart },
  { to: '/registers', label: 'Cadastros', icon: Settings },
]

export default function Layout() {
  const { user, userRole, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  const userName = (user?.name as string) || (user?.email as string) || 'Usuário'
  const roleLabel =
    userRole === 'admin' ? 'Administrador' : userRole === 'consultor' ? 'Consultor' : ''

  const renderNav = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold">Gestão de Obra</span>
        </div>
        <div className="flex-1 p-3">{renderNav()}</div>
        <div className="border-t p-3">
          <div className="mb-2 px-3">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Gestão de Obra
                </SheetTitle>
              </SheetHeader>
              <div className="p-3">{renderNav(() => setMobileOpen(false))}</div>
            </SheetContent>
          </Sheet>
          <span className="text-sm font-bold">Gestão de Obra</span>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
