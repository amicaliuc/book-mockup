import type { LightingConfig } from '../types/book.types'

export const defaultLightingConfig: LightingConfig = {
  lights: [
    {
      id: 'key',
      type: 'directional',
      color: '#ffffff',
      intensity: 1.2,
      position: [-3, 4, 3],
      castShadow: false,
    },
    {
      id: 'fill',
      type: 'directional',
      color: '#fff5e0',
      intensity: 0.4,
      position: [4, 1, 2],
      castShadow: false,
    },
    {
      id: 'rim',
      type: 'directional',
      color: '#c8d8ff',
      intensity: 0.6,
      position: [-2, 2, -4],
      castShadow: false,
    },
    {
      id: 'ambient',
      type: 'ambient',
      color: '#ffffff',
      intensity: 0.3,
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
