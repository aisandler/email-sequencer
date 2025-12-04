import { useState, useCallback, useEffect } from 'react'
import type { EmailSequence } from '../types'

// Simple state management without external dependencies
// Using a singleton pattern with React state

let globalState: {
  isGenerating: boolean
  sequence: EmailSequence | null
  error: string | null
} = {
  isGenerating: false,
  sequence: null,
  error: null,
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

export function useGenerationStore() {
  const [, forceUpdate] = useState({})

  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = subscribe(() => forceUpdate({}))
    return unsubscribe
  }, [])

  const setGenerating = useCallback((isGenerating: boolean) => {
    globalState = { ...globalState, isGenerating }
    notifyListeners()
  }, [])

  const setSequence = useCallback((sequence: EmailSequence | null) => {
    globalState = { ...globalState, sequence }
    notifyListeners()
  }, [])

  const setError = useCallback((error: string | null) => {
    globalState = { ...globalState, error }
    notifyListeners()
  }, [])

  const reset = useCallback(() => {
    globalState = { isGenerating: false, sequence: null, error: null }
    notifyListeners()
  }, [])

  return {
    ...globalState,
    setGenerating,
    setSequence,
    setError,
    reset,
  }
}
