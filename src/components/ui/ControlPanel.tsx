import { useExportContext } from '../../context/ExportContext'
import { CoverSection } from './sections/CoverSection'
import { SpineSection } from './sections/SpineSection'
import { MaterialSection } from './sections/MaterialSection'
import { EnvironmentSection } from './sections/EnvironmentSection'
import { CameraSection } from './sections/CameraSection'
import { LightingSection } from './sections/LightingSection'
import { ExportSection } from './sections/ExportSection'
import { PresetsSection } from './sections/PresetsSection'

export function ControlPanel() {
  const exportRef = useExportContext()

  return (
    <div className="w-72 h-full bg-white overflow-y-auto p-6 flex flex-col gap-8 border-l border-neutral-100">
      <PresetsSection />
      <CoverSection />
      <SpineSection />
      <MaterialSection />
      <EnvironmentSection />
      <CameraSection />
      <LightingSection />
      <ExportSection onExport={() => exportRef.current?.()} />
    </div>
  )
}
