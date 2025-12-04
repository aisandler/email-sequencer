import { useState } from 'react'
import { Card, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { useToast } from '../../context/ToastContext'
import { useAI } from '../../context/AIContext'
import { useFormData } from '../../context/FormDataContext'
import { generateLiveIcebreaker } from '../../lib/generators/icebreakerGenerator'

interface IcebreakerPanelProps {
  icebreakerPrompt: string
}

export function IcebreakerPanel({ icebreakerPrompt }: IcebreakerPanelProps) {
  const { copy } = useCopyToClipboard()
  const { addToast } = useToast()
  const { config } = useAI()
  const { formData } = useFormData()

  const [mode, setMode] = useState<'export' | 'live'>('export')
  const [prospectEmail, setProspectEmail] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [liveResult, setLiveResult] = useState<string | null>(null)

  const handleCopyPrompt = async () => {
    const success = await copy(icebreakerPrompt)
    if (success) {
      addToast('Icebreaker prompt copied', 'success')
    }
  }

  const handleGenerateLive = async () => {
    if (!prospectEmail) {
      addToast('Please enter a prospect email', 'error')
      return
    }

    setIsGenerating(true)
    setLiveResult(null)

    try {
      const result = await generateLiveIcebreaker(prospectEmail, formData, config)
      setLiveResult(result)
      addToast('Icebreaker generated!', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      addToast(msg, 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLiveResult = async () => {
    if (!liveResult) return
    const success = await copy(liveResult)
    if (success) {
      addToast('Icebreaker copied', 'success')
    }
  }

  return (
    <Card>
      <CardHeader
        title="Icebreaker Generator"
        description="Create personalized opening lines"
        icon={
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        }
      />

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border mb-4">
        <button
          onClick={() => setMode('export')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'export'
              ? 'bg-accent text-white'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Export Prompt
        </button>
        <button
          onClick={() => setMode('live')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'live'
              ? 'bg-accent text-white'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Live Test
        </button>
      </div>

      {mode === 'export' ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
              AI Prompt for n8n / Automation
            </span>
            <Button variant="secondary" size="sm" onClick={handleCopyPrompt}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Prompt
            </Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            <pre className="p-4 rounded-lg bg-background border border-border text-sm text-foreground-muted whitespace-pre-wrap font-mono leading-relaxed">
              {icebreakerPrompt}
            </pre>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Prospect Email"
            type="email"
            value={prospectEmail}
            onChange={(e) => setProspectEmail(e.target.value)}
            placeholder="john@company.com"
          />

          <Button
            onClick={handleGenerateLive}
            loading={isGenerating}
            disabled={!prospectEmail || !config.isConfigured}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Icebreaker'}
          </Button>

          {!config.isConfigured && (
            <p className="text-xs text-center text-foreground-subtle">
              Configure your API key in Settings to use live generation
            </p>
          )}

          {liveResult && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
                  Generated Icebreaker
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopyLiveResult}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-foreground">{liveResult}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
