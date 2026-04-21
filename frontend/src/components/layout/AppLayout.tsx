import { Home, LogOut, PlusCircle } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '../ui/Button'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { logout } from '../../features/auth/authSlice'

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isNewActive = location.pathname === '/issues/new'
  const isIssuesActive = location.pathname.startsWith('/issues') && !isNewActive

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/issues" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Issue Tracker
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/issues"
              className={`focus-ring inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition ${
                isIssuesActive
                  ? 'bg-blue-100 font-semibold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Home size={16} /> Issues
            </NavLink>
            <NavLink
              to="/issues/new"
              className={() =>
                `focus-ring inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition ${
                  isNewActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <PlusCircle size={16} /> New
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <p className="hidden text-sm text-slate-600 md:block dark:text-slate-300">{user?.email}</p>
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={onLogout}>
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
