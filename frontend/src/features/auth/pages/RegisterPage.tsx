import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthForm } from '../components/AuthForm'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { clearAuthFeedback, registerUser } from '../authSlice'

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authStatus = useAppSelector((state) => state.auth.status)
  const error = useAppSelector((state) => state.auth.error)

  const handleSubmit = async (payload: { email: string; password: string }) => {
    await dispatch(registerUser(payload)).unwrap()
    dispatch(clearAuthFeedback())
    toast.success('Account created!')
    navigate('/issues', { replace: true })
  }

  return (
    <div className="space-y-3 text-center">
      {error ? <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <AuthForm
        mode="register"
        loading={authStatus === 'loading'}
        onSubmit={handleSubmit}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link className="text-blue-600 hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}
