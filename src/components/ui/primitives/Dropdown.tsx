interface Props<T extends string> {
  value: T
  options: { label: string; value: T }[]
  onChange: (v: T) => void
}
export function Dropdown<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none bg-neutral-100 rounded-full px-4 py-2.5 font-mono text-xs font-semibold tracking-widest uppercase text-neutral-800 cursor-pointer focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">▾</div>
    </div>
  )
}
