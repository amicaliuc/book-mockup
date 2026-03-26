import type { ExportConfig } from '../types/book.types'

export const defaultExportConfig: ExportConfig = {
  resolution: '2x',
  ratio: '1:1',
  customWidth: 1200,
  customHeight: 1200,
  format: 'png',
  transparentBackground: false,
}

export const RATIO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '1:1':  { width: 1200, height: 1200 },
  '4:3':  { width: 1600, height: 1200 },
  '16:9': { width: 1920, height: 1080 },
}

export const RESOLUTION_MULTIPLIERS: Record<string, number> = {
  '1x': 1,
  '2x': 2,
  '4x': 4,
}
