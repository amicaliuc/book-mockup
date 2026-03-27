import { BookScene } from './components/scene/BookScene'
import { ControlPanel } from './components/ui/ControlPanel'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-neutral-50 overflow-hidden">
      <div className="flex-1 relative">
        <ErrorBoundary>
          <BookScene />
        </ErrorBoundary>
      </div>
      <ControlPanel />
    </div>
  )
}
