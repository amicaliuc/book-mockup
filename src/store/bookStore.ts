import { create } from 'zustand'
import type { BookStoreState, BookConfig, CameraConfig, LightingConfig, EnvironmentConfig, MaterialConfig, ExportConfig } from '../types/book.types'
import { defaultBookConfig } from '../config/book.config'
import { defaultCameraConfig } from '../config/camera.config'
import { defaultLightingConfig } from '../config/lighting.config'
import { defaultEnvironmentConfig } from '../config/environment.config'
import { defaultMaterialConfig } from '../config/material.config'
import { defaultExportConfig } from '../config/export.config'

interface BookStore extends BookStoreState {
  setBook: (patch: Partial<BookConfig>) => void
  setCamera: (patch: Partial<CameraConfig>) => void
  setLighting: (patch: Partial<LightingConfig>) => void
  setEnvironment: (patch: Partial<EnvironmentConfig>) => void
  setMaterial: (patch: Partial<MaterialConfig>) => void
  setExport: (patch: Partial<ExportConfig>) => void
  applyPreset: (state: BookStoreState) => void
  reset: () => void
}

const defaultState: BookStoreState = {
  book: { ...defaultBookConfig },
  camera: { ...defaultCameraConfig },
  lighting: { ...defaultLightingConfig },
  environment: { ...defaultEnvironmentConfig },
  material: { ...defaultMaterialConfig },
  export_: { ...defaultExportConfig },
}

export const useBookStore = create<BookStore>((set) => ({
  ...defaultState,
  setBook: (patch) => set((s) => ({ book: { ...s.book, ...patch } })),
  setCamera: (patch) => set((s) => ({ camera: { ...s.camera, ...patch } })),
  setLighting: (patch) => set((s) => ({ lighting: { ...s.lighting, ...patch } })),
  setEnvironment: (patch) => set((s) => ({ environment: { ...s.environment, ...patch } })),
  setMaterial: (patch) => set((s) => ({ material: { ...s.material, ...patch } })),
  setExport: (patch) => set((s) => ({ export_: { ...s.export_, ...patch } })),
  applyPreset: (state) => set(state),
  reset: () => set(defaultState),
}))
