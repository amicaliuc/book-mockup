import { create } from 'zustand'

interface ExportTriggerStore {
  trigger: number
  transparentBackground: boolean
  fire: (transparentBackground: boolean) => void
}

export const useExportTriggerStore = create<ExportTriggerStore>((set) => ({
  trigger: 0,
  transparentBackground: false,
  fire: (transparentBackground) => set((s) => ({ trigger: s.trigger + 1, transparentBackground })),
}))
