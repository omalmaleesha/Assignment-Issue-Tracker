const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

interface UnitConfig {
  unit: Intl.RelativeTimeFormatUnit
  seconds: number
}

const units: UnitConfig[] = [
  { unit: 'year', seconds: 60 * 60 * 24 * 365 },
  { unit: 'month', seconds: 60 * 60 * 24 * 30 },
  { unit: 'week', seconds: 60 * 60 * 24 * 7 },
  { unit: 'day', seconds: 60 * 60 * 24 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
]

export function formatRelativeTime(input: string | number | Date): string {
  const date = input instanceof Date ? input : new Date(input)

  if (Number.isNaN(date.getTime())) {
    return 'just now'
  }

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)

  for (const { unit, seconds } of units) {
    if (Math.abs(diffSeconds) >= seconds || unit === 'second') {
      const value = Math.round(diffSeconds / seconds)

      if (unit === 'second' && Math.abs(value) < 10) {
        return 'just now'
      }

      return rtf.format(value, unit)
    }
  }

  return 'just now'
}
