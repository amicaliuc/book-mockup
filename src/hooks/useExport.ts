import { useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { useBookStore } from '../store/bookStore'
import { RATIO_DIMENSIONS, RESOLUTION_MULTIPLIERS } from '../config/export.config'

export function useExport() {
  const { gl, scene, camera } = useThree()
  const export_ = useBookStore((s) => s.export_)

  const capture = useCallback(() => {
    const { resolution, ratio, customWidth, customHeight, transparentBackground } = export_

    // Determine target pixel dimensions
    const multiplier = RESOLUTION_MULTIPLIERS[resolution] ?? 1
    const base = ratio === 'custom'
      ? { width: customWidth, height: customHeight }
      : RATIO_DIMENSIONS[ratio] ?? { width: 1200, height: 1200 }

    const targetW = base.width * multiplier
    const targetH = base.height * multiplier

    // Store original CSS size (NOT domElement pixel size — that's devicePixelRatio-scaled)
    const origW = gl.domElement.clientWidth
    const origH = gl.domElement.clientHeight

    // Resize + render (false = skip internal pixel ratio multiplication)
    gl.setSize(targetW, targetH, false)
    if (transparentBackground) {
      gl.setClearColor(0x000000, 0)
    }
    gl.render(scene, camera)

    const dataUrl = gl.domElement.toDataURL('image/png')

    // Restore using CSS dimensions + false to skip pixel ratio scaling
    gl.setSize(origW, origH, false)

    // Trigger download
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `book-mockup-${Date.now()}.png`
    a.click()
  }, [gl, scene, camera, export_])

  return { capture }
}
