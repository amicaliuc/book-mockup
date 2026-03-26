import { useRef } from 'react'
import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { UploadZone } from '../primitives/UploadZone'
import type { SpineStyle } from '../../../types/book.types'

const SPINE_STYLES: { label: string; value: SpineStyle }[] = [
  { label: 'Flat', value: 'flat' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Hard', value: 'hardcover' },
]

export function SpineSection() {
  const book = useBookStore((s) => s.book)
  const setBook = useBookStore((s) => s.setBook)
  const prevUrlRef = useRef<string | null>(null)

  function handleFile(file: File) {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current)
    const url = URL.createObjectURL(file)
    prevUrlRef.current = url
    setBook({ spineImageUrl: url })
  }

  return (
    <div>
      <SectionHeader label="Spine" />
      <div className="flex gap-1 mb-3">
        {SPINE_STYLES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setBook({ spineStyle: value })}
            className={`flex-1 py-1.5 text-xs font-mono font-semibold tracking-widest rounded-full transition-colors
              ${book.spineStyle === value
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>
      <UploadZone
        label="Drop spine PNG"
        preview={book.spineImageUrl}
        onFile={handleFile}
      />
    </div>
  )
}
