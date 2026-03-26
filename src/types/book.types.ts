import type * as THREE from 'three'

export interface BookConfig {
  width: number
  height: number
  depth: number
  spineRadius: number
  pageInset: number
  pageColor: string
  pageRoughness: number
  coverBevelSize: number
  backCoverVisible: boolean
  backCoverColor: string
  spineStyle: SpineStyle
  coverImageUrl: string | null
  spineImageUrl: string | null
  backCoverImageUrl: string | null
}

export interface CameraPreset {
  position: [number, number, number]
  fov: number
  target: [number, number, number]
}

export interface CameraConfig {
  position: [number, number, number]
  fov: number
  target: [number, number, number]
  near: number
  far: number
  orbitEnabled: boolean
  presets: Record<string, CameraPreset>
}

export type LightType = 'ambient' | 'directional' | 'spot' | 'point'

export interface LightConfig {
  id: string
  type: LightType
  color: string
  intensity: number
  position: [number, number, number]
  castShadow: boolean
}

export interface ContactShadowConfig {
  opacity: number
  blur: number
  far: number
  resolution: number
}

export interface LightingConfig {
  lights: LightConfig[]
  contactShadow: ContactShadowConfig
}

export type EnvironmentPreset = 'studio' | 'outdoor' | 'dramatic' | 'minimal' | 'apartment' | 'city' | 'dawn' | 'sunset' | 'desk'
export type BackgroundType = 'hdri' | 'solid' | 'gradient' | 'transparent'

export interface EnvironmentConfig {
  preset: EnvironmentPreset
  backgroundType: BackgroundType
  backgroundColor: string
  gradientFrom: string
  gradientTo: string
}

export type CoverFinish = 'matte' | 'satin' | 'gloss' | 'original'
export type SpineStyle = 'flat' | 'rounded' | 'hardcover'

export interface MaterialConfig {
  coverRoughness: number
  coverMetalness: number
  coverFinish: CoverFinish
  spineRoughness: number
  spineMetalness: number
  coverNormalMapFile: File | null
  coverRoughnessMapFile: File | null
}

export type ExportResolution = '1x' | '2x' | '4x'
export type ExportRatio = '1:1' | '4:3' | '16:9' | 'custom'

export interface ExportConfig {
  resolution: ExportResolution
  ratio: ExportRatio
  customWidth: number
  customHeight: number
  format: 'png'
  transparentBackground: boolean
}

export interface BookStoreState {
  book: BookConfig
  camera: CameraConfig
  lighting: LightingConfig
  environment: EnvironmentConfig
  material: MaterialConfig
  export_: ExportConfig
}

export interface BookTextures {
  coverTexture: THREE.Texture | null
  spineTexture: THREE.Texture | null
  loading: { cover: boolean; spine: boolean }
}
