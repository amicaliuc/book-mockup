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
]

const BG_TYPES: { label: string; value: BackgroundType }[] = [
  { label: 'Solid', value: 'solid' },
  { label: 'HDRI', value: 'hdri' },
  { label: 'Transparent', value: 'transparent' },
  // 'gradient' deferred to v2
]

const QUICK_COLORS = ['#f5f5f5', '#1a1a1a', '#3ecfb2', '#e8d5c0', '#c8d8ff']

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
        <div className="flex gap-2 mt-3">
          {QUICK_COLORS.map((c) => (
            <ColorSwatch
              key={c} color={c}
              selected={environment.backgroundColor === c}
              onClick={() => setEnvironment({ backgroundColor: c })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
