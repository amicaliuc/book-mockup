import { useState } from 'react'
import { useBookStore } from '../../../store/bookStore'
import { SectionHeader } from '../primitives/SectionHeader'
import { UploadZone } from '../primitives/UploadZone'

export function SpineSection() {
  const setBook = useBookStore((s) => s.setBook)
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <div>
      <SectionHeader label="Spine" />
      <UploadZone
        label="Drop spine PNG"
        preview={preview}
        onFile={(file) => {
          setBook({ spineImageFile: file })
          setPreview(URL.createObjectURL(file))
        }}
      />
    </div>
  )
}
