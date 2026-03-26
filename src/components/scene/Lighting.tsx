import { useBookStore } from '../../store/bookStore'

export function Lighting() {
  const { lights } = useBookStore((s) => s.lighting)

  return (
    <>
      {lights.map((light) => {
        const pos = light.position as [number, number, number]
        if (light.type === 'ambient') {
          return <ambientLight key={light.id} color={light.color} intensity={light.intensity} />
        }
        if (light.type === 'directional') {
          return <directionalLight key={light.id} color={light.color} intensity={light.intensity} position={pos} />
        }
        if (light.type === 'spot') {
          return <spotLight key={light.id} color={light.color} intensity={light.intensity} position={pos} />
        }
        if (light.type === 'point') {
          return <pointLight key={light.id} color={light.color} intensity={light.intensity} position={pos} />
        }
        return null
      })}
    </>
  )
}
