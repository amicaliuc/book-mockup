import { useRef } from 'react'
import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { UploadZone } from '../primitives/UploadZone'
import { Toggle } from '../primitives/Toggle'
import { Slider } from '../primitives/Slider'

const QUICK_COLORS = [
  '#e8e0d8', '#1a1a1e', '#2c3e50', '#8b4513',
  '#1a3a2a', '#3d1a3a', '#f5f0e8', '#c8b8a8',
]

export function CoverSection() {
  const book = useBookStore((s) => s.book)
  const setBook = useBookStore((s) => s.setBook)
  const prevUrlRef = useRef<string | null>(null)
  const prevBackUrlRef = useRef<string | null>(null)

  function handleFrontFile(file: File) {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current)
    const url = URL.createObjectURL(file)
    prevUrlRef.current = url
    setBook({ coverImageUrl: url })
  }

  function handleBackFile(file: File) {
    if (prevBackUrlRef.current) URL.revokeObjectURL(prevBackUrlRef.current)
    const url = URL.createObjectURL(file)
    prevBackUrlRef.current = url
    setBook({ backCoverImageUrl: url })
  }

  return (
    <div>
      <SectionHeader label="Cover" />
      <UploadZone
        label="Drop front cover PNG"
        preview={book.coverImageUrl}
        onFile={handleFrontFile}
      />

      <div className="mt-4">
        <Toggle
          label="Show back cover"
          value={book.backCoverVisible}
          onChange={(v) => setBook({ backCoverVisible: v })}
        />
      </div>

      {book.backCoverVisible && (
        <div className="mt-4 pl-0">
          <p className="font-mono text-xs font-semibold tracking-widest text-neutral-400 mb-2">BACK COVER</p>

          {/* Color quick picks */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {QUICK_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setBook({ backCoverColor: c })}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full border transition-transform hover:scale-110
                  ${book.backCoverColor === c ? 'ring-2 ring-black ring-offset-1' : 'border-neutral-200'}`}
              />
            ))}
            <input
              type="color"
              value={book.backCoverColor}
              onChange={(e) => setBook({ backCoverColor: e.target.value })}
              className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent"
              title="Custom color"
            />
          </div>

          {/* Back cover image upload */}
          <UploadZone
            label="Drop back cover PNG"
            preview={book.backCoverImageUrl}
            onFile={handleBackFile}
          />
        </div>
      )}

      <div className="mt-6">
        <SectionHeader label="Dimensions" />
        <Slider label="Width"  value={book.width}  min={0.8} max={2.2} step={0.01} onChange={(v) => setBook({ width: v })} />
        <Slider label="Height" value={book.height} min={1.2} max={3.5} step={0.01} onChange={(v) => setBook({ height: v })} />
        <Slider label="Depth"  value={book.depth}  min={0.04} max={0.6} step={0.01} onChange={(v) => setBook({ depth: v })} />
      </div>
    </div>
  )
}
