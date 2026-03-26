import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { Dropdown } from '../primitives/Dropdown'
import { ColorSwatch } from '../primitives/ColorSwatch'
import type { EnvironmentPreset, BackgroundType } from '../../../types/book.types'

const ENV_PRESETS: { label: string; value: EnvironmentPreset }[] = [
  { label: 'Studio', value: 'studio' },
  { label: 'Outdoor', value: 'outdoor' },
  { label: 'Dramatic', value: 'dramatic' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'City', value: 'city' },
  { label: 'Dawn', value: 'dawn' },
  { label: 'Sunset', value: 'sunset' },
  { label: 'Desk', value: 'desk' },
]

const BG_TYPES: { label: string; value: BackgroundType }[] = [
  { label: 'Solid', value: 'solid' },
  { label: 'HDRI', value: 'hdri' },
]

const QUICK_COLORS = [
  '#1a1a1e', // dark studio
  '#0d0d0f', // near black
  '#2c2c34', // dark purple-gray
  '#f5f5f5', // white studio
  '#e8d5c0', // warm paper
  '#c8d8ff', // cool blue
]

export function EnvironmentSection() {
  const environment = useBookStore((s) => s.environment)
  const setEnvironment = useBookStore((s) => s.setEnvironment)

  return (
    <div>
      <SectionHeader label="Environment" />
      <div className="mb-3">
        <Dropdown value={environment.preset} options={ENV_PRESETS} onChange={(v) => setEnvironment({ preset: v })} />
      </div>
      <div className="mb-3">
        <Dropdown value={environment.backgroundType} options={BG_TYPES} onChange={(v) => setEnvironment({ backgroundType: v })} />
      </div>
      {environment.backgroundType === 'solid' && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_COLORS.map((c) => (
              <ColorSwatch
                key={c} color={c}
                selected={environment.backgroundColor === c}
                onClick={() => setEnvironment({ backgroundColor: c })}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={environment.backgroundColor}
              onChange={(e) => setEnvironment({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded-full cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={environment.backgroundColor}
              onChange={(e) => {
                const v = e.target.value
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setEnvironment({ backgroundColor: v })
              }}
              className="flex-1 bg-neutral-100 rounded-full px-3 py-1.5 font-mono text-xs text-neutral-700 focus:outline-none"
              placeholder="#1a1a1e"
            />
          </div>
        </div>
      )}
    </div>
  )
}
