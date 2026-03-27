import { useState } from 'react'
import { useBookStore } from '../../../store/bookStore'
import { useExportTriggerStore } from '../../../store/exportTriggerStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { Dropdown } from '../primitives/Dropdown'
import { Toggle } from '../primitives/Toggle'
import { PillButton } from '../primitives/PillButton'
import type { ExportResolution, ExportRatio } from '../../../types/book.types'

const RESOLUTION_OPTIONS: { label: string; value: ExportResolution }[] = [
  { label: '1×', value: '1x' },
  { label: '2×', value: '2x' },
  { label: '4×', value: '4x' },
]

const RATIO_OPTIONS: { label: string; value: ExportRatio }[] = [
  { label: '1:1 Square', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9 Wide', value: '16:9' },
  { label: 'Custom', value: 'custom' },
]

export function ExportSection() {
  const exp = useBookStore((s) => s.export_)
  const setExport = useBookStore((s) => s.setExport)
  const fire = useExportTriggerStore((s) => s.fire)

  // Transparent BG is local state — it ONLY affects the export render, never the live scene.
  // Keeping it out of the global store prevents any possibility of toggling it causing
  // a re-render of R3F components or a scene state change.
  const [transparentBackground, setTransparentBackground] = useState(false)

  return (
    <div>
      <SectionHeader label="Export" />
      <div className="mb-3">
        <Dropdown value={exp.ratio} options={RATIO_OPTIONS} onChange={(v) => setExport({ ratio: v })} />
      </div>
      <div className="mb-3">
        <Dropdown value={exp.resolution} options={RESOLUTION_OPTIONS} onChange={(v) => setExport({ resolution: v })} />
      </div>
      <div className="mb-4">
        <Toggle
          label="Transparent BG"
          value={transparentBackground}
          onChange={setTransparentBackground}
        />
      </div>
      <PillButton
        variant="primary"
        className="w-full flex justify-center"
        onClick={() => fire(transparentBackground)}
      >
        Download PNG
      </PillButton>
    </div>
  )
}
