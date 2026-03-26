import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SectionHeader } from '../../src/components/ui/primitives/SectionHeader'
import { PillButton } from '../../src/components/ui/primitives/PillButton'
import { Slider } from '../../src/components/ui/primitives/Slider'
import { Toggle } from '../../src/components/ui/primitives/Toggle'

describe('UI Primitives', () => {
  it('SectionHeader renders uppercase label', () => {
    render(<SectionHeader label="colors" />)
    expect(screen.getByText('COLORS')).toBeInTheDocument()
  })

  it('PillButton calls onClick', () => {
    const onClick = vi.fn()
    render(<PillButton onClick={onClick}>Click</PillButton>)
    fireEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('Slider calls onChange with numeric value', () => {
    const onChange = vi.fn()
    render(<Slider label="speed" value={0.5} min={0} max={1} onChange={onChange} />)
    const input = screen.getByRole('slider')
    fireEvent.change(input, { target: { value: '0.75' } })
    expect(onChange).toHaveBeenCalledWith(0.75)
  })

  it('Toggle calls onChange with inverted boolean', () => {
    const onChange = vi.fn()
    render(<Toggle value={false} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
