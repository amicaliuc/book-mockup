import { useMemo } from 'react'
import * as THREE from 'three'
import { useBookStore } from '../../store/bookStore'
import { useBookTextures } from '../../hooks/useBookTextures'
import {
  createCoverGeometry,
  createSpineGeometry,
  createPageBlockGeometry,
  createCoverBevelGeometry,
} from './BookGeometry'

const FALLBACK_COLOR = '#3ecfb2'

export function BookMesh() {
  const book = useBookStore((s) => s.book)
  const material = useBookStore((s) => s.material)
  const { coverTexture, spineTexture } = useBookTextures()

  const coverGeo = useMemo(() => createCoverGeometry(book), [book.width, book.height])
  const spineGeo = useMemo(() => createSpineGeometry(book), [book.spineRadius, book.height])
  const pageGeo = useMemo(() => createPageBlockGeometry(book), [book.width, book.height, book.depth, book.pageInset])
  const bevelGeo = useMemo(() => createCoverBevelGeometry(book), [book.width, book.height, book.depth, book.coverBevelSize])

  const finishRoughness = { matte: 0.85, satin: 0.5, gloss: 0.1 }[material.coverFinish]
  const spineX = -(book.width / 2 + book.spineRadius * 0.5)

  return (
    <group>
      {/* Pages block */}
      <mesh geometry={pageGeo} position={[0, 0, 0]}>
        <meshStandardMaterial color={book.pageColor} roughness={book.pageRoughness} />
      </mesh>

      {/* Front cover */}
      <mesh geometry={coverGeo} position={[0, 0, book.depth / 2 + 0.002]}>
        <meshStandardMaterial
          map={coverTexture ?? undefined}
          color={coverTexture ? undefined : FALLBACK_COLOR}
          roughness={finishRoughness}
          metalness={material.coverMetalness}
        />
      </mesh>

      {/* Back cover (hidden by default) */}
      {book.backCoverVisible && (
        <mesh geometry={coverGeo} position={[0, 0, -(book.depth / 2 + 0.002)]} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial color={FALLBACK_COLOR} roughness={finishRoughness} />
        </mesh>
      )}

      {/* Spine */}
      <mesh geometry={spineGeo} position={[spineX, 0, 0]}>
        <meshStandardMaterial
          map={spineTexture ?? undefined}
          color={spineTexture ? undefined : FALLBACK_COLOR}
          roughness={material.spineRoughness}
          metalness={material.spineMetalness}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cover bevel */}
      <mesh geometry={bevelGeo} position={[0, 0, 0]}>
        <meshStandardMaterial color="#d0ccc8" roughness={0.8} />
      </mesh>
    </group>
  )
}
