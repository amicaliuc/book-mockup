import { createContext, useContext, type MutableRefObject } from 'react'

export const ExportContext = createContext<MutableRefObject<(() => void) | null>>(
  { current: null } as MutableRefObject<(() => void) | null>
)
export const useExportContext = () => useContext(ExportContext)
