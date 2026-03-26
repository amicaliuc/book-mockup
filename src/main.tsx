import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { usePresetStore } from './store/presetStore'
import { BUILT_IN_PRESETS } from './presets/builtins'

// Load user presets from localStorage, then always overwrite built-in presets with latest defaults
const presetStore = usePresetStore.getState()
presetStore.loadFromStorage()
Object.entries(BUILT_IN_PRESETS).forEach(([name, state]) => {
  presetStore.savePreset(name, state)
})
presetStore.applyPreset('Studio')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
