import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/Button'
import { useDarkMode } from '../../hooks/useDarkMode'

export function ThemeToggle() {
  const { isDark, toggleMode } = useDarkMode()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  )
}
