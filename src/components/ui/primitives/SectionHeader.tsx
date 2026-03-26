interface Props { label: string; onReset?: () => void }
export function SectionHeader({ label, onReset }: Props) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="font-mono text-xs font-semibold tracking-widest text-neutral-800">
        {label.toUpperCase()}
      </span>
      {onReset && (
        <button onClick={onReset} className="text-neutral-400 hover:text-neutral-700 transition-colors text-sm">
          ↺
        </button>
      )}
    </div>
  )
}
