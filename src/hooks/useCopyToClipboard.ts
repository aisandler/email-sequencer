import { useState, useCallback } from 'react'

interface UseCopyToClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<boolean>
  reset: () => void
}

export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      // Auto-reset after delay
      setTimeout(() => {
        setCopied(false)
      }, resetDelay)

      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      setCopied(false)
      return false
    }
  }, [resetDelay])

  const reset = useCallback(() => {
    setCopied(false)
  }, [])

  return { copied, copy, reset }
}
