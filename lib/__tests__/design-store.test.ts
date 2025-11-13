import { renderHook, act } from '@testing-library/react'
import { useDesignStore } from '../store/design-store'
import type { DesignSpec } from '@/lib/claude/client'

const mockDesign: DesignSpec = {
  layout: 'flex-col',
  components: [
    {
      type: 'card',
      props: {},
      styles: {
        className: 'bg-blue-500 p-4',
      },
    },
  ],
  theme: {
    colors: { primary: '#3b82f6' },
    spacing: { sm: '8px' },
    typography: { base: '16px' },
  },
}

describe('useDesignStore', () => {
  beforeEach(() => {
    useDesignStore.setState({
      currentDesign: null,
      promptHistory: [],
      isGenerating: false,
      error: null,
    })
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useDesignStore())

    expect(result.current.currentDesign).toBeNull()
    expect(result.current.promptHistory).toEqual([])
    expect(result.current.isGenerating).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets current design', () => {
    const { result } = renderHook(() => useDesignStore())

    act(() => {
      result.current.setCurrentDesign(mockDesign)
    })

    expect(result.current.currentDesign).toEqual(mockDesign)
    expect(result.current.error).toBeNull()
  })

  it('adds prompt to history', () => {
    const { result } = renderHook(() => useDesignStore())

    act(() => {
      result.current.addPromptToHistory('gradient card')
      result.current.addPromptToHistory('blue button')
    })

    expect(result.current.promptHistory).toEqual([
      'gradient card',
      'blue button',
    ])
  })

  it('sets generating state', () => {
    const { result } = renderHook(() => useDesignStore())

    act(() => {
      result.current.setIsGenerating(true)
    })

    expect(result.current.isGenerating).toBe(true)

    act(() => {
      result.current.setIsGenerating(false)
    })

    expect(result.current.isGenerating).toBe(false)
  })

  it('sets error and stops generating', () => {
    const { result } = renderHook(() => useDesignStore())

    act(() => {
      result.current.setIsGenerating(true)
      result.current.setError('API error')
    })

    expect(result.current.error).toBe('API error')
    expect(result.current.isGenerating).toBe(false)
  })

  it('clears design state', () => {
    const { result } = renderHook(() => useDesignStore())

    act(() => {
      result.current.setCurrentDesign(mockDesign)
      result.current.addPromptToHistory('test prompt')
      result.current.setIsGenerating(true)
      result.current.setError('test error')
    })

    act(() => {
      result.current.clearDesign()
    })

    expect(result.current.currentDesign).toBeNull()
    expect(result.current.promptHistory).toEqual([])
    expect(result.current.isGenerating).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('clears error when setting new design', () => {
    const { result } = renderHook(() => useDesignStore())

    act(() => {
      result.current.setError('previous error')
      result.current.setCurrentDesign(mockDesign)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.currentDesign).toEqual(mockDesign)
  })
})
