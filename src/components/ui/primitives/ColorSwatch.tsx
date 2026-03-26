interface Props { color: string; selected?: boolean; onClick?: () => void }
export function ColorSwatch({ color, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`w-10 h-10 rounded-full transition-transform hover:scale-105 ${selected ? 'ring-2 ring-black ring-offset-2' : ''}`}
    />
  )
}
