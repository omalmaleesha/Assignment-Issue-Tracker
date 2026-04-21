import type { PropsWithChildren } from 'react'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="surface w-full max-w-md p-6 sm:p-8">{children}</div>
    </main>
  )
}
