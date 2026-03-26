import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useBookStore } from '../../../store/bookStore'
import { usePresetStore } from '../../../store/presetStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { PillButton } from '../primitives/PillButton'

export function PresetsSection() {
  const [saveName, setSaveName] = useState('')
  // useShallow prevents new object reference every render (fixes Zustand v5 getSnapshot loop)
  const bookState = useBookStore(useShallow((s) => ({
    book: s.book,
    camera: s.camera,
    lighting: s.lighting,
    environment: s.environment,
    material: s.material,
    export_: s.export_,
  })))
  const presets = usePresetStore((s) => s.presets)
  const activePreset = usePresetStore((s) => s.activePreset)
  const savePreset = usePresetStore((s) => s.savePreset)
  const applyPreset = usePresetStore((s) => s.applyPreset)
  // Note: built-in preset names can be overwritten in v1 (future: read-only flag)

  return (
    <div>
      <SectionHeader label="Presets" />
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(presets).map((name) => (
          <PillButton
            key={name}
            variant={activePreset === name ? 'primary' : 'default'}
            onClick={() => applyPreset(name)}
          >
            {name}
          </PillButton>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Preset name..."
          className="flex-1 bg-neutral-100 rounded-full px-4 py-2 font-mono text-xs text-neutral-800 focus:outline-none"
        />
        <PillButton onClick={() => { if (saveName) { savePreset(saveName, bookState); setSaveName('') } }}>
          Save
        </PillButton>
      </div>
    </div>
  )
}
