import { useState } from 'react'
import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { UploadZone } from '../primitives/UploadZone'
import { Toggle } from '../primitives/Toggle'

export function CoverSection() {
  const book = useBookStore((s) => s.book)
  const setBook = useBookStore((s) => s.setBook)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  return (
    <div>
      <SectionHeader label="Cover" />
      <UploadZone
        label="Drop front cover PNG"
        preview={coverPreview}
        onFile={(file) => {
          setBook({ coverImageFile: file })
          setCoverPreview(URL.createObjectURL(file))
        }}
      />
      <div className="mt-3">
        <Toggle
          label="Show back cover"
          value={book.backCoverVisible}
          onChange={(v) => setBook({ backCoverVisible: v })}
        />
      </div>
    </div>
  )
}
