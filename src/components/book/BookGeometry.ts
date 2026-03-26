import * as THREE from 'three'
import type { BookConfig } from '../../types/book.types'

/** Front or back cover plane */
export function createCoverGeometry(cfg: BookConfig): THREE.PlaneGeometry {
  return new THREE.PlaneGeometry(cfg.width, cfg.height)
}

/**
 * Spine as a partial cylinder arc.
 * UV.x is remapped to the arc's angular range so texture fills exactly.
 */
export function createSpineGeometry(cfg: BookConfig): THREE.CylinderGeometry {
  const arcAngle = Math.PI * 0.18  // ~32° arc
  const geo = new THREE.CylinderGeometry(
    cfg.spineRadius, cfg.spineRadius,
    cfg.height,
    16,
    1,
    true,
    -arcAngle / 2,
    arcAngle,
  )
  // Remap UV.x so texture spans full spine width, not full cylinder circumference
  const uvAttr = geo.attributes.uv as THREE.BufferAttribute
  const posAttr = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < uvAttr.count; i++) {
    const x = posAttr.getX(i)
    const z = posAttr.getZ(i)
    const theta = Math.atan2(x, z)
    uvAttr.setX(i, (theta + arcAngle / 2) / arcAngle)
  }
  uvAttr.needsUpdate = true
  return geo
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
