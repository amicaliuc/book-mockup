import type { BookStoreState } from '../types/book.types'
import { defaultBookConfig } from '../config/book.config'
import { defaultCameraConfig } from '../config/camera.config'
import { defaultLightingConfig } from '../config/lighting.config'
import { defaultMaterialConfig } from '../config/material.config'
import { defaultExportConfig } from '../config/export.config'

const base: BookStoreState = {
  book: { ...defaultBookConfig },
  camera: { ...defaultCameraConfig },
  lighting: { ...defaultLightingConfig },
  material: { ...defaultMaterialConfig },
  export_: { ...defaultExportConfig },
  environment: { preset: 'studio', backgroundType: 'solid', backgroundColor: '#f5f5f5', gradientFrom: '#e8e8e8', gradientTo: '#ffffff' },
}

export const BUILT_IN_PRESETS: Record<string, BookStoreState> = {
  Studio: { ...base },
  Dark: {
    ...base,
    environment: { ...base.environment, backgroundType: 'solid', backgroundColor: '#111111' },
    lighting: {
      ...base.lighting,
      lights: base.lighting.lights.map((l) =>
        l.id === 'rim' ? { ...l, intensity: 1.2 } :
        l.id === 'key' ? { ...l, intensity: 0.8 } :
        l.id === 'fill' ? { ...l, intensity: 0.15 } : l
      ),
    },
  },
  Outdoor: {
    ...base,
    environment: { ...base.environment, preset: 'outdoor', backgroundType: 'hdri' },
  },
  Minimal: {
    ...base,
    environment: { ...base.environment, backgroundType: 'transparent' },
    lighting: {
      ...base.lighting,
      lights: base.lighting.lights.map((l) =>
        l.id === 'ambient' ? { ...l, intensity: 1.0 } : { ...l, intensity: 0.2 }
      ),
    },
  },
}
