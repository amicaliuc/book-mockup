import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { Slider } from '../primitives/Slider'
import { Toggle } from '../primitives/Toggle'
import { PillButton } from '../primitives/PillButton'

export function CameraSection() {
  const camera = useBookStore((s) => s.camera)
  const setCamera = useBookStore((s) => s.setCamera)

  return (
    <div>
      <SectionHeader label="Camera" />
      <Slider label="FOV" value={camera.fov} min={20} max={90} step={1} onChange={(v) => setCamera({ fov: v })} />
      <div className="mb-3">
        <Toggle label="Orbit" value={camera.orbitEnabled} onChange={(v) => setCamera({ orbitEnabled: v })} />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(camera.presets).map(([name, preset]) => (
          <PillButton key={name} onClick={() => setCamera({ position: preset.position, fov: preset.fov, target: preset.target })}>
            {name}
          </PillButton>
        ))}
      </div>
    </div>
  )
}
