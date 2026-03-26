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
    const origW = gl.domElement.clientWidth
    const origH = gl.domElement.clientHeight

    const origClearColor = new THREE.Color()
    gl.getClearColor(origClearColor)
    const origBackground = scene.background

    let dataUrl: string | null = null
    try {
      gl.setSize(targetW, targetH, false)
      if (export_.transparentBackground) {
        scene.background = null
        gl.setClearColor(0x000000, 0)
      }
      gl.render(scene, camera)
      dataUrl = gl.domElement.toDataURL('image/png')
    } catch (e) {
      // Swallow — do NOT let this propagate out of useEffect.
      // An uncaught error inside useEffect unmounts the entire React tree (blank page).
      console.warn('[Export] Canvas capture failed:', e)
    } finally {
      // Always restore regardless of success or failure
      gl.setSize(origW, origH, false)
      gl.setClearColor(origClearColor, 1)
      scene.background = origBackground
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
      gl={{ preserveDrawingBuffer: true, alpha: true }}
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
