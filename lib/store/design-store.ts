import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DesignSpec } from '@/lib/claude/client'

export interface DesignState {
  currentDesign: DesignSpec | null
  promptHistory: string[]
  isGenerating: boolean
  error: string | null
}

export interface DesignActions {
  setCurrentDesign: (design: DesignSpec | null) => void
  addPromptToHistory: (prompt: string) => void
  setIsGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
  clearDesign: () => void
}

export type DesignStore = DesignState & DesignActions

const initialState: DesignState = {
  currentDesign: null,
  promptHistory: [],
  isGenerating: false,
  error: null,
}

export const useDesignStore = create<DesignStore>()(
  persist(
    set => ({
      ...initialState,

      setCurrentDesign: design =>
        set({ currentDesign: design, error: null }),

      addPromptToHistory: prompt =>
        set(state => ({
          promptHistory: [...state.promptHistory, prompt],
        })),

      setIsGenerating: isGenerating => set({ isGenerating }),

      setError: error => set({ error, isGenerating: false }),

      clearDesign: () => set(initialState),
    }),
    {
      name: 'design-weave-storage',
      partialize: state => ({
        currentDesign: state.currentDesign,
        promptHistory: state.promptHistory,
      }),
    }
  )
)
