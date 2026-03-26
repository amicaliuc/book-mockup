import type { LightingConfig } from '../types/book.types'

export const defaultLightingConfig: LightingConfig = {
  lights: [
    {
      id: 'key',
      type: 'directional',
      color: '#f0f0ec',
      intensity: 1.7,
      position: [-3, 5, 5],
      castShadow: false,
    },
    {
      id: 'fill',
      type: 'directional',
      color: '#fff5e0',
      intensity: 0.6,
      position: [5, 1, 3],
      castShadow: false,
    },
    {
      id: 'rim',
      type: 'directional',
      color: '#b0c8ff',
      intensity: 0.7,
      position: [-2, 3, -5],
      castShadow: false,
    },
    {
      id: 'ambient',
      type: 'ambient',
      color: '#ffffff',
      intensity: 0.12,
      position: [0, 0, 0],
      castShadow: false,
    },
  ],
  contactShadow: {
    opacity: 0.3,
    blur: 2.5,
    far: 1.5,
    resolution: 512,
  },
}
