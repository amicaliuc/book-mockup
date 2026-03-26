import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment as DreiEnvironment } from '@react-three/drei'
import * as THREE from 'three'
import { useBookStore } from '../../store/bookStore'

const DREI_PRESETS = {
  studio: 'studio',
  outdoor: 'park',
  dramatic: 'night',
  minimal: 'warehouse',
} as const

export function SceneEnvironment() {
  const { preset, backgroundType, backgroundColor } = useBookStore((s) => s.environment)
  const { scene } = useThree()

  useEffect(() => {
    if (backgroundType === 'solid') {
      scene.background = new THREE.Color(backgroundColor)
    } else if (backgroundType === 'transparent' || backgroundType === 'hdri') {
      scene.background = null
    }
    // 'gradient' is deferred to v2
  }, [backgroundType, backgroundColor, scene])

  if (backgroundType === 'hdri') {
    return <DreiEnvironment preset={DREI_PRESETS[preset]} background />
  }
  return <DreiEnvironment preset={DREI_PRESETS[preset]} />
}
