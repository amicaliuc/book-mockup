import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { Slider } from '../primitives/Slider'
import { Dropdown } from '../primitives/Dropdown'
import type { CoverFinish } from '../../../types/book.types'

const FINISH_OPTIONS: { label: string; value: CoverFinish }[] = [
  { label: 'Matte', value: 'matte' },
  { label: 'Satin', value: 'satin' },
  { label: 'Gloss', value: 'gloss' },
  { label: 'Original (no lighting)', value: 'original' },
]

/** Roughness presets for each finish — applied to the slider when a finish is selected */
const FINISH_ROUGHNESS: Record<CoverFinish, number> = {
  matte: 0.9,
  satin: 0.5,
  gloss: 0.08,
  original: 1.0,
}

export function MaterialSection() {
  const material = useBookStore((s) => s.material)
  const setMaterial = useBookStore((s) => s.setMaterial)

  function handleFinishChange(v: CoverFinish) {
    setMaterial({ coverFinish: v, coverRoughness: FINISH_ROUGHNESS[v] })
  }

  return (
    <div>
      <SectionHeader label="Material" />
      <div className="mb-4">
        <Dropdown value={material.coverFinish} options={FINISH_OPTIONS} onChange={handleFinishChange} />
      </div>
      {material.coverFinish !== 'original' && (
        <>
          <Slider label="Cover Roughness" value={material.coverRoughness} min={0} max={1} onChange={(v) => setMaterial({ coverRoughness: v })} />
          <Slider label="Cover Metalness" value={material.coverMetalness} min={0} max={1} onChange={(v) => setMaterial({ coverMetalness: v })} />
          <Slider label="Spine Roughness" value={material.spineRoughness} min={0} max={1} onChange={(v) => setMaterial({ spineRoughness: v })} />
        </>
      )}
    </div>
  )
}
