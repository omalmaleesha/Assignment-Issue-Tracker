import { useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'

type ThemeMode = 'light' | 'dark'

export function useDarkMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.theme)
    if (saved === 'light' || saved === 'dark') return saved

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    localStorage.setItem(STORAGE_KEYS.theme, mode)
  }, [mode])

  const isDark = useMemo(() => mode === 'dark', [mode])

  return {
    isDark,
    mode,
    toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
  }
}
