import type { CameraConfig } from '../types/book.types'

export const defaultCameraConfig: CameraConfig = {
  position: [3.2, 1.8, 4.0],
  fov: 42,
  target: [0, 0, 0],
  near: 0.1,
  far: 100,
  orbitEnabled: true,
  presets: {
    Reference: { position: [3.2, 1.8, 4.0],  fov: 42, target: [0, 0, 0] },
    Reversed:  { position: [-3.2, 1.8, 4.0], fov: 42, target: [0, 0, 0] },
    Front:     { position: [0, 0, 5.0],      fov: 45, target: [0, 0, 0] },
    Top:       { position: [0, 5.0, 1.0],    fov: 45, target: [0, 0, 0] },
    Side:      { position: [-4.0, 0.5, 1.5], fov: 45, target: [0, 0, 0] },
  },
}
