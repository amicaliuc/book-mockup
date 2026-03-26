import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { Slider } from '../primitives/Slider'
import { Dropdown } from '../primitives/Dropdown'
import type { CoverFinish } from '../../../types/book.types'

const FINISH_OPTIONS: { label: string; value: CoverFinish }[] = [
  { label: 'Matte', value: 'matte' },
  { label: 'Satin', value: 'satin' },
  { label: 'Gloss', value: 'gloss' },
]

export function MaterialSection() {
  const material = useBookStore((s) => s.material)
  const setMaterial = useBookStore((s) => s.setMaterial)

  return (
    <div>
      <SectionHeader label="Material" />
      <div className="mb-4">
        <Dropdown value={material.coverFinish} options={FINISH_OPTIONS} onChange={(v) => setMaterial({ coverFinish: v })} />
      </div>
      <Slider label="Cover Roughness" value={material.coverRoughness} min={0} max={1} onChange={(v) => setMaterial({ coverRoughness: v })} />
      <Slider label="Cover Metalness" value={material.coverMetalness} min={0} max={1} onChange={(v) => setMaterial({ coverMetalness: v })} />
      <Slider label="Spine Roughness" value={material.spineRoughness} min={0} max={1} onChange={(v) => setMaterial({ spineRoughness: v })} />
    </div>
  )
}
