import { create } from 'zustand'
import type { BookStoreState } from '../types/book.types'
import { useBookStore } from './bookStore'

const STORAGE_KEY = 'book-mockup-presets'

interface PresetStore {
  presets: Record<string, BookStoreState>
  activePreset: string
  savePreset: (name: string, state: BookStoreState) => void
  applyPreset: (name: string) => void
  deletePreset: (name: string) => void
  loadFromStorage: () => void
}

function persistPresets(presets: Record<string, BookStoreState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  } catch {}
}

export const usePresetStore = create<PresetStore>((set, get) => ({
  presets: {},
  activePreset: 'Studio',
  savePreset: (name, state) => {
    const presets = { ...get().presets, [name]: state }
    set({ presets, activePreset: name })
    persistPresets(presets)
  },
  applyPreset: (name) => {
    const preset = get().presets[name]
    if (!preset) return
    useBookStore.getState().applyPreset(preset)
    set({ activePreset: name })
  },
  deletePreset: (name) => {
    const { [name]: _removed, ...rest } = get().presets
    void _removed
    set({ presets: rest })
    persistPresets(rest)
  },
  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) set({ presets: JSON.parse(raw) as Record<string, BookStoreState> })
    } catch {}
  },
}))
