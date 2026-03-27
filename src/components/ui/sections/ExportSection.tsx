import { useCallback, useRef } from 'react'
import { useBookStore } from '../../../store/bookStore'
import { useExportTriggerStore } from '../../../store/exportTriggerStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { Dropdown } from '../primitives/Dropdown'
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

/**
 * Transparent BG uses a ref + manual DOM update instead of useState.
 * This guarantees ZERO React re-renders when toggling — eliminating any
 * possibility of cascading re-renders that could destabilize R3F/WebGL.
 */
export function ExportSection() {
  const exp = useBookStore((s) => s.export_)
  const setExport = useBookStore((s) => s.setExport)
  const fire = useExportTriggerStore((s) => s.fire)

  const transparentRef = useRef(false)
  const toggleTrackRef = useRef<HTMLDivElement>(null)
  const toggleThumbRef = useRef<HTMLDivElement>(null)

  const handleToggle = useCallback(() => {
    transparentRef.current = !transparentRef.current
    const on = transparentRef.current
    // Update DOM directly — no React state change, no re-render
    if (toggleTrackRef.current) {
      toggleTrackRef.current.className = `w-10 h-6 rounded-full transition-colors relative ${on ? 'bg-black' : 'bg-neutral-200'}`
    }
    if (toggleThumbRef.current) {
      toggleThumbRef.current.className = `absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : 'translate-x-1'}`
    }
  }, [])

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
        <label className="flex items-center gap-3 cursor-pointer" onClick={handleToggle}>
          <div
            ref={toggleTrackRef}
            className="w-10 h-6 rounded-full transition-colors relative bg-neutral-200"
          >
            <div
              ref={toggleThumbRef}
              className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform translate-x-1"
            />
          </div>
          <span className="font-mono text-xs text-neutral-600 uppercase tracking-widest">Transparent BG</span>
        </label>
      </div>
      <PillButton
        variant="primary"
        className="w-full flex justify-center"
        onClick={() => fire(transparentRef.current)}
      >
        Download PNG
      </PillButton>
    </div>
  )
}
