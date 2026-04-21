import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4" role="presentation" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={cn('surface w-full max-w-md animate-fadeIn p-5')}
      >
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        {children}
      </section>
    </div>,
    document.body,
  )
}
