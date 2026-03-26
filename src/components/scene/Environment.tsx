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
  apartment: 'apartment',
  city: 'city',
  dawn: 'dawn',
  sunset: 'sunset',
  desk: 'lobby',
} as const

export function SceneEnvironment() {
  const { preset, backgroundType, backgroundColor } = useBookStore((s) => s.environment)
  const { scene } = useThree()

  useEffect(() => {
    // For HDRI, DreiEnvironment manages the background itself; set null to let it take over.
    // For transparent (legacy/export preset only), fall back to a neutral light color so
    // the live view never goes completely white and the UI stays visible.
    if (backgroundType === 'solid') {
      scene.background = new THREE.Color(backgroundColor)
    } else if (backgroundType === 'hdri') {
      scene.background = null
    } else {
      // transparent or any unknown value — show a neutral fallback in live view
      scene.background = new THREE.Color('#f0ede8')
    }
  }, [backgroundType, backgroundColor, scene])

  if (backgroundType === 'hdri') {
    return <DreiEnvironment preset={DREI_PRESETS[preset]} background />
  }
  return <DreiEnvironment preset={DREI_PRESETS[preset]} />
}
