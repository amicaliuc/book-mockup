import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBookTextures } from '../../src/hooks/useBookTextures'
import { useBookStore } from '../../src/store/bookStore'

// Mock THREE.TextureLoader
vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three')
  class MockTextureLoader {
    load(_url: string, onLoad: (t: unknown) => void) {
      onLoad({ isTexture: true, _url })
      return {}
    }
  }
  return { ...actual, TextureLoader: MockTextureLoader }
})

describe('useBookTextures', () => {
  beforeEach(() => {
    useBookStore.getState().setBook({ coverImageFile: null, spineImageFile: null })
  })

  it('returns null textures when no files are set', () => {
    const { result } = renderHook(() => useBookTextures())
    expect(result.current.coverTexture).toBeNull()
    expect(result.current.spineTexture).toBeNull()
  })

  it('loading is false when no files', () => {
    const { result } = renderHook(() => useBookTextures())
    expect(result.current.loading.cover).toBe(false)
    expect(result.current.loading.spine).toBe(false)
  })
})
