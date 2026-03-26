interface Props { value: boolean; onChange: (v: boolean) => void; label?: string }
export function Toggle({ value, onChange, label }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`w-10 h-6 rounded-full transition-colors relative ${value ? 'bg-black' : 'bg-neutral-200'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
      {label && <span className="font-mono text-xs text-neutral-600 uppercase tracking-widest">{label}</span>}
    </label>
  )
}
