import { Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Loader } from './components/ui/Loader'
import { useAppDispatch } from './hooks/useAppDispatch'
import { useAppSelector } from './hooks/useAppSelector'
import { AuthLayout } from './components/layout/AuthLayout'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { logout } from './features/auth/authSlice'

const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'))
const DashboardPage = lazy(() => import('./features/issues/pages/DashboardPage'))
const IssueDetailsPage = lazy(() => import('./features/issues/pages/IssueDetailsPage'))
const IssueEditorPage = lazy(() => import('./features/issues/pages/IssueEditorPage'))

function PublicOnly({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Navigate to="/issues" replace /> : <>{children}</>
}

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handler = () => {
      dispatch(logout())
    }

    window.addEventListener('app:unauthorized', handler)
    return () => window.removeEventListener('app:unauthorized', handler)
  }, [dispatch])

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader label="Loading page..." />
        </div>
      }
    >
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            </PublicOnly>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/issues" element={<DashboardPage />} />
          <Route path="/issues/new" element={<IssueEditorPage />} />
          <Route path="/issues/:issueId" element={<IssueDetailsPage />} />
          <Route path="/issues/:issueId/edit" element={<IssueEditorPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="*" element={<Navigate to="/issues" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
