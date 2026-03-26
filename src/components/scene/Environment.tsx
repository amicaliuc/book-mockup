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
    if (backgroundType === 'solid') {
      scene.background = new THREE.Color(backgroundColor)
    } else if (backgroundType !== 'hdri') {
      // transparent or any unknown value — show a neutral fallback so the canvas
      // never goes fully transparent in the live view
      scene.background = new THREE.Color('#f0ede8')
    }
    // hdri: do NOT touch scene.background here — DreiEnvironment's background prop
    // manages it. Setting null here causes a one-frame transparent flash.
  }, [backgroundType, backgroundColor, scene])

  if (backgroundType === 'hdri') {
    return <DreiEnvironment preset={DREI_PRESETS[preset]} background />
  }
  return <DreiEnvironment preset={DREI_PRESETS[preset]} />
}
