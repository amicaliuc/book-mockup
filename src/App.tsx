import { useRef, type MutableRefObject } from 'react'
import { ExportContext } from './context/ExportContext'
import { BookScene } from './components/scene/BookScene'
import { ControlPanel } from './components/ui/ControlPanel'

export default function App() {
  const exportRef = useRef<(() => void) | null>(null) as MutableRefObject<(() => void) | null>

  return (
    <ExportContext.Provider value={exportRef}>
      <div className="flex h-screen w-screen bg-neutral-50 overflow-hidden">
        <div className="flex-1 relative">
          <BookScene />
        </div>
        <ControlPanel />
      </div>
    </ExportContext.Provider>
  )
}
