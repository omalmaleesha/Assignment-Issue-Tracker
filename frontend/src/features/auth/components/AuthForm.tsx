import { useMemo, useRef, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

type Mode = 'login' | 'register'

interface FormValues {
  email: string
  password: string
  confirmPassword: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

interface AuthFormProps {
  mode: Mode
  loading: boolean
  onSubmit: (payload: { email: string; password: string }) => Promise<void>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthForm({ mode, loading, onSubmit }: AuthFormProps) {
  const [values, setValues] = useState<FormValues>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const title = useMemo(
    () => (mode === 'login' ? 'Sign in to your workspace' : 'Create your account'),
    [mode],
  )

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!EMAIL_REGEX.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
      nextErrors.password = 'Password must include at least one letter and one number.'
    }

    if (mode === 'register' && values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)

    if (nextErrors.email) emailRef.current?.focus()
    else if (nextErrors.password) passwordRef.current?.focus()

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    const payload = { email: values.email, password: values.password }

    await onSubmit(payload)
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit} noValidate>
      <header className="space-y-0.5 text-center">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight sm:text-2xl">{title}</h1>
        <p className="mx-auto max-w-xs text-sm leading-5 text-slate-500 dark:text-slate-400">
          {mode === 'login'
            ? 'Use your credentials to access issues.'
            : 'Register and start tracking issues quickly.'}
        </p>
      </header>

      <Input
        ref={emailRef}
        autoComplete="email"
        type="email"
        name="email"
        label="Email"
        hideLabel
        aria-label="Email"
        placeholder="Enter your email"
        value={values.email}
        error={errors.email}
        onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
      />

      <Input
        ref={passwordRef}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        type="password"
        name="password"
        label="Password"
        hideLabel
        aria-label="Password"
        placeholder="Enter your password"
        value={values.password}
        error={errors.password}
        onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
      />

      {mode === 'register' ? (
        <Input
          autoComplete="new-password"
          type="password"
          name="confirmPassword"
          label="Confirm password"
          hideLabel
          aria-label="Confirm password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              confirmPassword: event.target.value,
            }))
          }
        />
      ) : null}

      <Button type="submit" className="w-full" loading={loading}>
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </Button>
    </form>
  )
}
