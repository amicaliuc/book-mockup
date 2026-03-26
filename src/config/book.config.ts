import type { BookConfig } from '../types/book.types'

export const defaultBookConfig: BookConfig = {
  width: 1.4,
  height: 2.1,
  depth: 0.08,
  spineRadius: 0.05,
  pageInset: 0.02,
  pageColor: '#f0ece4',
  pageRoughness: 0.9,
  coverBevelSize: 0.008,
  backCoverVisible: false,
  coverImageFile: null,
  spineImageFile: null,
}
