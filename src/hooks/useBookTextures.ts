import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useBookStore } from '../store/bookStore'
import type { BookTextures } from '../types/book.types'

export function useBookTextures(): BookTextures {
  const coverFile = useBookStore((s) => s.book.coverImageFile)
  const spineFile = useBookStore((s) => s.book.spineImageFile)

  const [coverTexture, setCoverTexture] = useState<THREE.Texture | null>(null)
  const [spineTexture, setSpineTexture] = useState<THREE.Texture | null>(null)
  const [loading, setLoading] = useState({ cover: false, spine: false })

  useEffect(() => {
    if (!coverFile) { setCoverTexture(null); return }

    const url = URL.createObjectURL(coverFile)
    setLoading((l) => ({ ...l, cover: true }))

    const loader = new THREE.TextureLoader()
    loader.load(url, (tex) => {
      (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace
      setCoverTexture(tex as THREE.Texture)
      setLoading((l) => ({ ...l, cover: false }))
    })

    // Single cleanup path — no duplicate revoke
    return () => { URL.revokeObjectURL(url) }
  }, [coverFile])

  useEffect(() => {
    if (!spineFile) { setSpineTexture(null); return }

    const url = URL.createObjectURL(spineFile)
    setLoading((l) => ({ ...l, spine: true }))

    const loader = new THREE.TextureLoader()
    loader.load(url, (tex) => {
      (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace
      setSpineTexture(tex as THREE.Texture)
      setLoading((l) => ({ ...l, spine: false }))
    })

    return () => { URL.revokeObjectURL(url) }
  }, [spineFile])

  return { coverTexture, spineTexture, loading }
}
