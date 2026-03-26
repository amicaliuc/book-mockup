interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
}
export function Slider({ label, value, min, max, step = 0.01, onChange }: Props) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="font-mono text-xs font-semibold tracking-widest text-neutral-800">{label.toUpperCase()}</span>
        <span className="font-mono text-xs text-neutral-400">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        role="slider"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-neutral-200 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}
