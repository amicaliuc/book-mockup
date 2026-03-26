import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useBookStore } from '../../store/bookStore'
import { useExportTriggerStore } from '../../store/exportTriggerStore'
import { RATIO_DIMENSIONS, RESOLUTION_MULTIPLIERS } from '../../config/export.config'
import { BookMesh } from '../book/BookMesh'
import { Lighting } from './Lighting'
import { SceneEnvironment } from './Environment'

function CameraSync() {
  const camStore = useBookStore((s) => s.camera)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(...camStore.position)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = camStore.fov
      camera.near = camStore.near
      camera.far = camStore.far
      camera.updateProjectionMatrix()
    }
  }, [camStore.position, camStore.fov, camStore.near, camStore.far, camera])

  return null
}

function ExportBridge() {
  const { gl, scene, camera } = useThree()
  const trigger = useExportTriggerStore((s) => s.trigger)
  // Initialize to the CURRENT trigger so Suspense remounts don't re-fire a stale export
  const prevTrigger = useRef(trigger)

  useEffect(() => {
    if (trigger <= prevTrigger.current) return
    prevTrigger.current = trigger

    const export_ = useBookStore.getState().export_
    const multiplier = RESOLUTION_MULTIPLIERS[export_.resolution] ?? 1
    const base = export_.ratio === 'custom'
      ? { width: export_.customWidth, height: export_.customHeight }
      : RATIO_DIMENSIONS[export_.ratio] ?? { width: 1200, height: 1200 }

    const targetW = base.width * multiplier
    const targetH = base.height * multiplier

    let dataUrl: string | null = null
    try {
      // Render into an off-screen WebGLRenderTarget — the live canvas is never
      // resized or cleared, so the live view is completely unaffected.
      const rt = new THREE.WebGLRenderTarget(targetW, targetH, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      })

      // Temporarily adjust camera aspect to match export dimensions
      const origAspect = camera instanceof THREE.PerspectiveCamera ? camera.aspect : null
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = targetW / targetH
        camera.updateProjectionMatrix()
      }

      // Handle transparent background
      const origBackground = scene.background
      const origClearColor = new THREE.Color()
      const origClearAlpha = gl.getClearAlpha()
      gl.getClearColor(origClearColor)
      if (export_.transparentBackground) {
        scene.background = null
        gl.setClearColor(0x000000, 0)
      }

      // Render to off-screen target (does NOT touch the live canvas buffer)
      gl.setRenderTarget(rt)
      gl.clear()
      gl.render(scene, camera)
      gl.setRenderTarget(null)

      // Restore all state immediately after render
      scene.background = origBackground
      gl.setClearColor(origClearColor, origClearAlpha)
      if (origAspect !== null && camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = origAspect
        camera.updateProjectionMatrix()
      }

      // Read pixels from the render target (WebGL origin is bottom-left, flip Y)
      const pixels = new Uint8Array(targetW * targetH * 4)
      gl.readRenderTargetPixels(rt, 0, 0, targetW, targetH, pixels)
      rt.dispose()

      const flipped = new Uint8ClampedArray(targetW * targetH * 4)
      for (let y = 0; y < targetH; y++) {
        const src = (targetH - 1 - y) * targetW * 4
        flipped.set(pixels.subarray(src, src + targetW * 4), y * targetW * 4)
      }

      const canvas2d = document.createElement('canvas')
      canvas2d.width = targetW
      canvas2d.height = targetH
      canvas2d.getContext('2d')!.putImageData(new ImageData(flipped, targetW, targetH), 0, 0)
      dataUrl = canvas2d.toDataURL('image/png')
    } catch (e) {
      console.warn('[Export] Failed:', e)
    }

    if (dataUrl) {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `book-mockup-${Date.now()}.png`
      a.click()
    }
  }, [trigger, gl, scene, camera])

  return null
}

export function BookScene() {
  const camera = useBookStore((s) => s.camera)

  return (
    <Canvas
      camera={{
        position: camera.position,
        fov: camera.fov,
        near: camera.near,
        far: camera.far,
      }}
      gl={{ alpha: true }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <CameraSync />
        <ExportBridge />
        <SceneEnvironment />
        <Lighting />
        <BookMesh />
        {camera.orbitEnabled && (
          <OrbitControls target={camera.target} makeDefault />
        )}
      </Suspense>
    </Canvas>
  )
}
