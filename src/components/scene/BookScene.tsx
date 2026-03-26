import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useBookStore } from '../../store/bookStore'
import { BookMesh } from '../book/BookMesh'
import { Lighting } from './Lighting'
import { SceneEnvironment } from './Environment'
import { useExport } from '../../hooks/useExport'
import { useExportContext } from '../../context/ExportContext'

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
  const { capture } = useExport()
  const exportRef = useExportContext()
  exportRef.current = capture
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
      gl={{ preserveDrawingBuffer: true }}
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
