import { create } from 'zustand'

interface ExportTriggerStore {
  trigger: number
  fire: () => void
}

export const useExportTriggerStore = create<ExportTriggerStore>((set) => ({
  trigger: 0,
  fire: () => set((s) => ({ trigger: s.trigger + 1 })),
}))
