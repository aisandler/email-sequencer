import { createContext, useContext, ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { AIConfig } from '../types'

interface AIContextType {
  config: AIConfig
  updateApiKey: (key: string) => void
  updateModel: (model: string) => void
  clearConfig: () => void
}

const AIContext = createContext<AIContextType | null>(null)

const DEFAULT_CONFIG: AIConfig = {
  apiKey: '',
  model: 'anthropic/claude-sonnet-4',
  isConfigured: false,
}

const AVAILABLE_MODELS = [
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5' },
]

export { AVAILABLE_MODELS }

export function AIProvider({ children }: { children: ReactNode }) {
  const [config, setConfig, clearConfig] = useLocalStorage<AIConfig>(
    'email-sequencer-ai-config',
    DEFAULT_CONFIG
  )

  const updateApiKey = (key: string) => {
    setConfig((prev) => ({
      ...prev,
      apiKey: key,
      isConfigured: key.length > 0,
    }))
  }

  const updateModel = (model: string) => {
    setConfig((prev) => ({
      ...prev,
      model,
    }))
  }

  return (
    <AIContext.Provider value={{ config, updateApiKey, updateModel, clearConfig }}>
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}
