import { useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useBookStore } from '../../store/bookStore'
import type { CoverFinish } from '../../types/book.types'
import {
  createCoverGeometry,
  createFlatSpineGeometry,
  createRoundedSpineGeometry,
  createHardcoverSpineGeometry,
  createPageBlockGeometry,
} from './BookGeometry'

const FALLBACK_COLOR = '#e8e0d8'
const COVER_THICKNESS = 0.005

/**
 * Fore-edge texture (right side, +x face of page block).
 * Shows vertical page-edge lines running top-to-bottom.
 * Canvas is wide (u=z direction = depth) × narrow (v=y direction = height).
 */
function makePageForeEdgeTex(pageColor: string): THREE.CanvasTexture {
  const w = 512
  const h = 32
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = pageColor
  ctx.fillRect(0, 0, w, h)

  const lineCount = 220
  const step = w / lineCount
  for (let i = 0; i < lineCount; i++) {
    const x = Math.round(i * step)
    const v = 90 + Math.random() * 6
    ctx.fillStyle = `hsl(35, 12%, ${v}%)`
    ctx.fillRect(x, 0, Math.max(1, Math.round(step * 0.65)), h)
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    ctx.fillRect(x + Math.round(step * 0.65), 0, 1, h)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

/**
 * Top/bottom edge texture (+y and -y faces of page block).
 * Canvas is narrow (u=x direction = width) × tall (v=z direction = depth).
 */
function makePageTopEdgeTex(pageColor: string): THREE.CanvasTexture {
  const w = 32
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = pageColor
  ctx.fillRect(0, 0, w, h)

  const lineCount = 220
  const step = h / lineCount
  for (let i = 0; i < lineCount; i++) {
    const y = Math.round(i * step)
    const v = 90 + Math.random() * 6
    ctx.fillStyle = `hsl(35, 12%, ${v}%)`
    ctx.fillRect(0, y, w, Math.max(1, Math.round(step * 0.65)))
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    ctx.fillRect(0, y + Math.round(step * 0.65), w, 1)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

/**
 * BoxGeometry face indices (Three.js standard):
 *   0=+x  1=-x  2=+y  3=-y  4=+z(front)  5=-z(back)
 *
 * After rotation [0,π,0] (back cover): face 5 (-z local) faces +z world (outward).
 * After rotation [0,π/2,0] (flat spine): face 5 (-z local) faces -x world (outward spine face).
 * No rotation (front cover): face 4 (+z local) faces +z world (outward).
 *
 * Edge faces (0–3 for cover sides, all non-texture faces for spine) must never show
 * the texture — use a plain dark color to eliminate the bright-edge artifact.
 */

function edgeMat(finish: CoverFinish, i: number) {
  return finish === 'original'
    ? <meshBasicMaterial key={i} attach={`material-${i}`} color={FALLBACK_COLOR} />
    : <meshStandardMaterial key={i} attach={`material-${i}`} color={FALLBACK_COLOR} roughness={0.8} metalness={0} />
}

/** Cover mesh with uploaded texture — texture only on the outward face, edges are plain dark. */
function CoverWithTexture({ url, geo, position, rotation, finish, roughness, metalness }: {
  url: string
  geo: THREE.BufferGeometry
  position: [number, number, number]
  rotation?: [number, number, number]
  finish: CoverFinish
  roughness: number
  metalness: number
}) {
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  // front cover (no rotation) → face 4; back cover (rotation Y=π) → face 5
  const texFace = rotation ? 5 : 4
  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      {[0, 1, 2, 3, 4, 5].map(i =>
        i === texFace
          ? finish === 'original'
            ? <meshBasicMaterial key={i} attach={`material-${i}`} map={texture} />
            : <meshStandardMaterial key={i} attach={`material-${i}`} map={texture} roughness={roughness} metalness={metalness} />
          : edgeMat(finish, i)
      )}
    </mesh>
  )
}

/** Spine mesh with uploaded texture — texture on face 5 (local -z → world -x after Y rotation). */
function SpineWithTexture({ url, geo, position, rotation, finish, roughness, metalness }: {
  url: string
  geo: THREE.BufferGeometry
  position: [number, number, number]
  rotation: [number, number, number]
  finish: CoverFinish
  roughness: number
  metalness: number
}) {
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      {[0, 1, 2, 3, 4, 5].map(i =>
        i === 5
          ? finish === 'original'
            ? <meshBasicMaterial key={i} attach={`material-${i}`} map={texture} />
            : <meshStandardMaterial key={i} attach={`material-${i}`} map={texture} roughness={roughness} metalness={metalness} />
          : edgeMat(finish, i)
      )}
    </mesh>
  )
}

export function BookMesh() {
  const book = useBookStore((s) => s.book)
  const material = useBookStore((s) => s.material)

  const coverGeo = useMemo(
    () => createCoverGeometry(book),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book.width, book.height],
  )

  // Spine geometry + x-center vary by style
  const { spineGeo, spineX } = useMemo(() => {
    if (book.spineStyle === 'rounded') {
      const { geo, xCenter } = createRoundedSpineGeometry(book)
      return { spineGeo: geo as THREE.BufferGeometry, spineX: xCenter }
    }
    // Flat/hardcover: center the spine so its right edge aligns with the page block left face,
    // completely covering the gap that would otherwise expose the white page block face.
    // spineThickness = pageInset + COVER_THICKNESS/2  →  right edge = -width/2 + pageInset
    const spineX = -book.width / 2 + book.pageInset / 2 - COVER_THICKNESS / 4
    if (book.spineStyle === 'hardcover') {
      return { spineGeo: createHardcoverSpineGeometry(book) as THREE.BufferGeometry, spineX }
    }
    return { spineGeo: createFlatSpineGeometry(book) as THREE.BufferGeometry, spineX }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.spineStyle, book.depth, book.height, book.width, book.pageInset])

  const pageGeo = useMemo(
    () => createPageBlockGeometry(book),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book.width, book.height, book.depth, book.pageInset],
  )
  const foreEdgeTex = useMemo(() => makePageForeEdgeTex(book.pageColor), [book.pageColor])
  const topEdgeTex = useMemo(() => makePageTopEdgeTex(book.pageColor), [book.pageColor])
  // Roughness comes directly from the material slider (finish dropdown sets a preset value via UI)
  const coverRoughness = material.coverRoughness
  const { coverFinish } = material

  const coverZ: [number, number, number] = [0, 0, book.depth / 2 + COVER_THICKNESS / 2 + 0.001]
  const backZ: [number, number, number] = [0, 0, -(book.depth / 2 + COVER_THICKNESS / 2 + 0.001)]
  const spinePos: [number, number, number] = [spineX, 0, 0]
  // Flat and hardcover rotate 90° around Y; rounded cylinder already faces the right direction
  const spineRot: [number, number, number] = book.spineStyle === 'rounded' ? [0, 0, 0] : [0, Math.PI / 2, 0]

  return (
    <group>
      {/* Pages block — per-face materials for correct page-edge lines */}
      <mesh geometry={pageGeo}>
        {/* +x fore-edge: vertical page lines */}
        <meshStandardMaterial attach="material-0" map={foreEdgeTex} color={book.pageColor} roughness={book.pageRoughness} />
        {/* -x spine side: dark binding edge — covered by spine in real books, never page-white */}
        <meshStandardMaterial attach="material-1" color="#1e1510" roughness={0.9} metalness={0} />
        {/* +y top edge: page lines looking from above */}
        <meshStandardMaterial attach="material-2" map={topEdgeTex} color={book.pageColor} roughness={book.pageRoughness} />
        {/* -y bottom edge */}
        <meshStandardMaterial attach="material-3" map={topEdgeTex} color={book.pageColor} roughness={book.pageRoughness} />
        {/* +z front: plain (hidden behind cover) */}
        <meshStandardMaterial attach="material-4" color={book.pageColor} roughness={book.pageRoughness} />
        {/* -z back: plain (hidden behind back cover) */}
        <meshStandardMaterial attach="material-5" color={book.pageColor} roughness={book.pageRoughness} />
      </mesh>

      {/* Front cover — face 4 (+z) is the outward face */}
      {book.coverImageUrl ? (
        <Suspense fallback={
          <mesh geometry={coverGeo} position={coverZ}>
            {[0,1,2,3,5].map(i => edgeMat(coverFinish, i))}
            {coverFinish === 'original'
              ? <meshBasicMaterial attach="material-4" color={FALLBACK_COLOR} />
              : <meshStandardMaterial attach="material-4" color={FALLBACK_COLOR} roughness={coverRoughness} metalness={material.coverMetalness} />
            }
          </mesh>
        }>
          <CoverWithTexture
            url={book.coverImageUrl}
            geo={coverGeo}
            position={coverZ}
            finish={coverFinish}
            roughness={coverRoughness}
            metalness={material.coverMetalness}
          />
        </Suspense>
      ) : (
        <mesh geometry={coverGeo} position={coverZ}>
          {[0,1,2,3,5].map(i => edgeMat(coverFinish, i))}
          {coverFinish === 'original'
            ? <meshBasicMaterial attach="material-4" color={FALLBACK_COLOR} />
            : <meshStandardMaterial attach="material-4" color={FALLBACK_COLOR} roughness={coverRoughness} metalness={material.coverMetalness} />
          }
        </mesh>
      )}

      {/* Back cover — rotation [0,π,0] makes face 5 (-z local) face outward */}
      {book.backCoverVisible && (
        book.backCoverImageUrl ? (
          <Suspense fallback={
            <mesh geometry={coverGeo} position={backZ} rotation={[0, Math.PI, 0]}>
              {[0,1,2,3,4].map(i => edgeMat(coverFinish, i))}
              {coverFinish === 'original'
                ? <meshBasicMaterial attach="material-5" color={book.backCoverColor} />
                : <meshStandardMaterial attach="material-5" color={book.backCoverColor} roughness={coverRoughness} metalness={material.coverMetalness} />
              }
            </mesh>
          }>
            <CoverWithTexture
              url={book.backCoverImageUrl}
              geo={coverGeo}
              position={backZ}
              rotation={[0, Math.PI, 0]}
              finish={coverFinish}
              roughness={coverRoughness}
              metalness={material.coverMetalness}
            />
          </Suspense>
        ) : (
          <mesh geometry={coverGeo} position={backZ} rotation={[0, Math.PI, 0]}>
            {[0,1,2,3,4].map(i => edgeMat(coverFinish, i))}
            {coverFinish === 'original'
              ? <meshBasicMaterial attach="material-5" color={book.backCoverColor} />
              : <meshStandardMaterial attach="material-5" color={book.backCoverColor} roughness={coverRoughness} metalness={material.coverMetalness} />
            }
          </mesh>
        )
      )}

      {/* Spine — face 5 (-z local → -x world after Y rotation) is the outward spine face */}
      {book.spineImageUrl ? (
        <Suspense fallback={
          <mesh geometry={spineGeo} position={spinePos} rotation={spineRot}>
            {[0,1,2,3,4].map(i => edgeMat(coverFinish, i))}
            {coverFinish === 'original'
              ? <meshBasicMaterial attach="material-5" color={FALLBACK_COLOR} />
              : <meshStandardMaterial attach="material-5" color={FALLBACK_COLOR} roughness={material.spineRoughness} metalness={material.spineMetalness} />
            }
          </mesh>
        }>
          <SpineWithTexture
            url={book.spineImageUrl}
            geo={spineGeo}
            position={spinePos}
            rotation={spineRot}
            finish={coverFinish}
            roughness={material.spineRoughness}
            metalness={material.spineMetalness}
          />
        </Suspense>
      ) : (
        <mesh geometry={spineGeo} position={spinePos} rotation={spineRot}>
          {[0,1,2,3,4].map(i => edgeMat(coverFinish, i))}
          {coverFinish === 'original'
            ? <meshBasicMaterial attach="material-5" color={FALLBACK_COLOR} />
            : <meshStandardMaterial attach="material-5" color={FALLBACK_COLOR} roughness={material.spineRoughness} metalness={material.spineMetalness} />
          }
        </mesh>
      )}
    </group>
  )
}
