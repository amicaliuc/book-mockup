import * as THREE from 'three'
import type { BookConfig } from '../../types/book.types'

const COVER_THICKNESS = 0.005

/** Front or back cover — thin box so edges have visible thickness */
export function createCoverGeometry(cfg: BookConfig): THREE.BoxGeometry {
  return new THREE.BoxGeometry(cfg.width, cfg.height, COVER_THICKNESS)
}

/**
 * Flat spine panel — a BoxGeometry rotated 90° around Y in the mesh.
 * Width (z-extent after rotation) spans outer face to outer face of both covers.
 * Thickness (x-extent after rotation) bridges from the cover outer edge to the page
 * block inner face, so there is no visible gap at the spine-cover-pageblock junction.
 */
export function createFlatSpineGeometry(cfg: BookConfig): THREE.BoxGeometry {
  // spineWidth must not exceed depth + COVER_THICKNESS*2 so face 1 (+z edge) stays inside
  // the front cover geometry and is occluded by it (cover front face = depth/2 + COVER_THICKNESS + 0.001)
  const spineWidth = cfg.depth + COVER_THICKNESS * 2 - 0.001
  const spineThickness = cfg.pageInset + COVER_THICKNESS / 2
  return new THREE.BoxGeometry(spineWidth, cfg.height, spineThickness)
}

/**
 * Hardcover spine — same flat panel but slightly taller (overhangs top/bottom)
 * and thicker, like a case-bound hardcover binding board.
 */
export function createHardcoverSpineGeometry(cfg: BookConfig): THREE.BoxGeometry {
  const OVERHANG = 0.02  // 2mm per side (scaled: 1 unit ≈ 100 mm)
  const spineWidth = cfg.depth + COVER_THICKNESS * 2 - 0.001
  const spineThickness = cfg.pageInset + COVER_THICKNESS / 2
  return new THREE.BoxGeometry(spineWidth, cfg.height + OVERHANG * 2, spineThickness * 1.6)
}

/**
 * Rounded spine — partial cylinder arc that bulges outward to the left,
 * with endpoints flush against the front and back cover edges.
 * Returns the geometry AND the cylinder center's x position.
 */
export function createRoundedSpineGeometry(cfg: BookConfig): {
  geo: THREE.CylinderGeometry
  xCenter: number
} {
  // Half-span in Z that the arc must bridge — extends to outer face of each cover
  const d = cfg.depth / 2 + COVER_THICKNESS + 0.0015
  // Desired outward bulge in -X (how far the spine protrudes beyond cover edge)
  const bulge = 0.035
  // Radius of the arc cylinder (derived from bulge and half-span)
  const r = (d * d + bulge * bulge) / (2 * bulge)
  // Half angle of the arc (sin(halfAngle) = d / r)
  const halfAngle = Math.asin(d / r)
  // Arc starts at -90° - halfAngle, spans 2×halfAngle (sweeps around -X side)
  const thetaStart = -(Math.PI / 2 + halfAngle)
  const thetaLength = 2 * halfAngle

  const geo = new THREE.CylinderGeometry(r, r, cfg.height, 32, 1, true, thetaStart, thetaLength)

  // Remap UV.x so texture spans the full arc (0 → back cover, 1 → front cover)
  const uvAttr = geo.attributes.uv as THREE.BufferAttribute
  const posAttr = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < uvAttr.count; i++) {
    const x = posAttr.getX(i)
    const z = posAttr.getZ(i)
    const theta = Math.atan2(x, z)
    uvAttr.setX(i, (theta - thetaStart) / thetaLength)
  }
  uvAttr.needsUpdate = true

  // Cylinder center sits slightly inside the book so the arc swings outward
  const xCenter = -cfg.width / 2 - bulge + r
  return { geo, xCenter }
}

/** Page block — inset from cover on all sides */
export function createPageBlockGeometry(cfg: BookConfig): THREE.BoxGeometry {
  const inset = cfg.pageInset
  return new THREE.BoxGeometry(
    cfg.width - inset * 2,
    cfg.height - inset * 2,
    cfg.depth * 0.85,
  )
}

/** Thin bevel box slightly larger than covers for chamfer edge effect */
export function createCoverBevelGeometry(cfg: BookConfig): THREE.BoxGeometry {
  return new THREE.BoxGeometry(
    cfg.width + cfg.coverBevelSize,
    cfg.height + cfg.coverBevelSize,
    cfg.depth + cfg.coverBevelSize * 2,
  )
}
