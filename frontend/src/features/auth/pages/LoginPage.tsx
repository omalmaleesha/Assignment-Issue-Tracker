import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthForm } from '../components/AuthForm'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { clearAuthFeedback, loginUser } from '../authSlice'
import securityImage from '../../../assets/security.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const authStatus = useAppSelector((state) => state.auth.status)
  const error = useAppSelector((state) => state.auth.error)

  const redirectPath = (location.state as { from?: string } | null)?.from ?? '/issues'

  const handleSubmit = async (payload: { email: string; password: string }) => {
    await dispatch(loginUser(payload)).unwrap()
    dispatch(clearAuthFeedback())
    toast.success('Welcome back!')
    navigate(redirectPath, { replace: true })
  }

  return (
    <div className="space-y-3 text-center">
      <div className="flex justify-center">
        <img
          src={securityImage}
          alt="Secure sign in"
          className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"
        />
      </div>
      {error ? <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <AuthForm
        mode="login"
        loading={authStatus === 'loading'}
        onSubmit={handleSubmit}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No account yet?{' '}
        <Link className="text-blue-600 hover:underline" to="/register">
          Create one
        </Link>
      </p>
    </div>
  )
}
