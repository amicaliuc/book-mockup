import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { createCoverGeometry, createSpineGeometry, createPageBlockGeometry } from '../../src/components/book/BookGeometry'
import { defaultBookConfig } from '../../src/config/book.config'

describe('BookGeometry', () => {
  const cfg = defaultBookConfig

  it('createCoverGeometry returns a PlaneGeometry', () => {
    const geo = createCoverGeometry(cfg)
    expect(geo).toBeInstanceOf(THREE.PlaneGeometry)
  })

  it('cover width matches config width', () => {
    const geo = createCoverGeometry(cfg)
    geo.computeBoundingBox()
    const size = new THREE.Vector3()
    geo.boundingBox!.getSize(size)
    expect(size.x).toBeCloseTo(cfg.width, 2)
  })

  it('createSpineGeometry returns a CylinderGeometry', () => {
    const geo = createSpineGeometry(cfg)
    expect(geo).toBeInstanceOf(THREE.CylinderGeometry)
  })

  it('createPageBlockGeometry returns a BoxGeometry', () => {
    const geo = createPageBlockGeometry(cfg)
    expect(geo).toBeInstanceOf(THREE.BoxGeometry)
  })

  it('page block is inset from cover dimensions', () => {
    const geo = createPageBlockGeometry(cfg)
    geo.computeBoundingBox()
    const size = new THREE.Vector3()
    geo.boundingBox!.getSize(size)
    expect(size.x).toBeLessThan(cfg.width)
    expect(size.y).toBeLessThan(cfg.height)
  })
})
