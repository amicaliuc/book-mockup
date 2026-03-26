import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { Slider } from '../primitives/Slider'

export function LightingSection() {
  const lighting = useBookStore((s) => s.lighting)
  const setLighting = useBookStore((s) => s.setLighting)

  return (
    <div>
      <SectionHeader label="Lighting" />
      {lighting.lights.map((light, i) => (
        <div key={light.id} className="mb-4">
          <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">{light.id} ({light.type})</p>
          <Slider
            label="Intensity"
            value={light.intensity}
            min={0} max={3}
            onChange={(v) => {
              const updated = lighting.lights.map((l, j) => j === i ? { ...l, intensity: v } : l)
              setLighting({ lights: updated })
            }}
          />
        </div>
      ))}
      <Slider
        label="Shadow Opacity"
        value={lighting.contactShadow.opacity}
        min={0} max={1}
        onChange={(v) => setLighting({ contactShadow: { ...lighting.contactShadow, opacity: v } })}
      />
    </div>
  )
}
