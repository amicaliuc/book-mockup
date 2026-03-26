import type { BookConfig } from '../types/book.types'

export const defaultBookConfig: BookConfig = {
  width: 1.4,
  height: 2.1,
  depth: 0.22,
  spineRadius: 0.12,
  pageInset: 0.01,
  pageColor: '#f0ece4',
  pageRoughness: 0.9,
  coverBevelSize: 0.008,
  backCoverVisible: true,
  backCoverColor: '#e8e0d8',
  spineStyle: 'flat',
  coverImageUrl: null,
  spineImageUrl: null,
  backCoverImageUrl: null,
}
