import { useAI, AVAILABLE_MODELS } from '../../context/AIContext'

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { config, updateApiKey, updateModel } = useAI()

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background-elevated border-l border-border z-50 animate-slide-in-right overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background-hover transition-colors"
            >
              <svg
                className="w-5 h-5 text-foreground-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* API Key Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                OpenRouter API Key
              </label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => updateApiKey(e.target.value)}
                placeholder="sk-or-..."
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent transition-colors"
              />
              <p className="mt-2 text-xs text-foreground-subtle">
                Get your API key from{' '}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  openrouter.ai/keys
                </a>
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                AI Model
              </label>
              <select
                value={config.model}
                onChange={(e) => updateModel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="p-4 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                {config.isConfigured ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm text-foreground">
                      API configured and ready
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                    <span className="text-sm text-foreground-muted">
                      Enter your API key to enable AI generation
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
