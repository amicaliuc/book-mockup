import { describe, it, expect, beforeEach } from 'vitest'
import { useBookStore } from '../../src/store/bookStore'
import { defaultBookConfig } from '../../src/config/book.config'

describe('bookStore', () => {
  beforeEach(() => useBookStore.setState({
    book: { ...defaultBookConfig },
  } as any))

  it('initializes with default book config', () => {
    const { book } = useBookStore.getState()
    expect(book.width).toBe(1.4)
    expect(book.height).toBe(2.1)
  })

  it('updates a book field', () => {
    useBookStore.getState().setBook({ width: 2.0 })
    expect(useBookStore.getState().book.width).toBe(2.0)
  })

  it('replaces full state on applyPreset', () => {
    const { applyPreset } = useBookStore.getState()
    applyPreset({ book: { ...defaultBookConfig, width: 9.9 } } as any)
    expect(useBookStore.getState().book.width).toBe(9.9)
  })
})
