import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePresetStore } from '../../src/store/presetStore'
import { useBookStore } from '../../src/store/bookStore'
import { defaultBookConfig } from '../../src/config/book.config'

vi.stubGlobal('localStorage', {
  store: {} as Record<string, string>,
  getItem(key: string) { return (this as any).store[key] ?? null },
  setItem(key: string, val: string) { (this as any).store[key] = val },
  removeItem(key: string) { delete (this as any).store[key] },
})

describe('presetStore', () => {
  beforeEach(() => {
    (localStorage as any).store = {}
    usePresetStore.setState({ presets: {}, activePreset: 'Studio' })
  })

  it('saves current bookStore state as preset', () => {
    const bookState = useBookStore.getState()
    usePresetStore.getState().savePreset('MyPreset', bookState)
    expect(usePresetStore.getState().presets['MyPreset']).toBeDefined()
  })

  it('applies preset to bookStore', () => {
    const bookState = useBookStore.getState()
    usePresetStore.getState().savePreset('Test', { ...bookState, book: { ...defaultBookConfig, width: 5.5 } })
    usePresetStore.getState().applyPreset('Test')
    expect(useBookStore.getState().book.width).toBe(5.5)
  })
})
