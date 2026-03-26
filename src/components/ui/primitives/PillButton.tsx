import type { ReactNode } from 'react'
interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary'
  className?: string
}
export function PillButton({ children, onClick, variant = 'default', className = '' }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-widest uppercase transition-colors
        ${variant === 'primary'
          ? 'bg-black text-white hover:bg-neutral-800'
          : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
