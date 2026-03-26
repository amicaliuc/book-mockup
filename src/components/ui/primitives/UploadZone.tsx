import { useRef } from 'react'
interface Props { label: string; accept?: string; onFile: (file: File) => void; preview?: string | null }
export function UploadZone({ label, accept = 'image/png,image/jpeg', onFile, preview }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) onFile(file)
      }}
      className="border-2 border-dashed border-neutral-200 rounded-2xl p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors min-h-[80px] flex items-center justify-center relative overflow-hidden"
    >
      {preview
        ? <img src={preview} alt="preview" className="max-h-24 object-contain rounded" />
        : <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">{label}</span>
      }
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
    </div>
  )
}
