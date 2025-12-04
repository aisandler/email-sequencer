import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { EmailCard } from '../output/EmailCard'
import { IcebreakerPanel } from '../output/IcebreakerPanel'
import { ValidationChecklist } from '../output/ValidationChecklist'
import { useGenerationStore } from '../../hooks/useGenerationStore'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { useToast } from '../../context/ToastContext'

export function OutputPanel() {
  const { sequence, isGenerating } = useGenerationStore()
  const { copy } = useCopyToClipboard()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'emails' | 'icebreaker' | 'validation'>('emails')

  const handleCopyAll = async () => {
    if (!sequence) return

    const allEmails = sequence.emails
      .map(
        (email, i) =>
          `--- EMAIL ${i + 1} (Day ${email.day}) ---\nSubject: ${email.subjectLine}\n\n${email.body}`
      )
      .join('\n\n')

    const success = await copy(allEmails)
    if (success) {
      addToast('All emails copied to clipboard', 'success')
    }
  }

  // Empty state
  if (!sequence && !isGenerating) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-subtle flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Ready to Generate
          </h3>
          <p className="text-sm text-foreground-muted max-w-[280px]">
            Fill in your details and click "Generate Email Sequence" to create your
            personalized cold email campaign.
          </p>
        </div>
      </Card>
    )
  }

  // Loading state
  if (isGenerating) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-subtle flex items-center justify-center animate-pulse-subtle">
            <svg
              className="w-8 h-8 text-accent animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Generating Your Sequence
          </h3>
          <p className="text-sm text-foreground-muted">
            AI is crafting your personalized emails...
          </p>
        </div>
      </Card>
    )
  }

  // Results
  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-background-card rounded-xl border border-border">
        {[
          { id: 'emails', label: 'Emails', count: sequence?.emails.length },
          { id: 'icebreaker', label: 'Icebreaker' },
          { id: 'validation', label: 'Validation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-foreground-muted hover:text-foreground hover:bg-background-hover'
              }
            `}
          >
            {tab.label}
            {tab.count && (
              <span className="ml-1.5 text-xs opacity-75">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'emails' && sequence && (
        <div className="space-y-4">
          {/* Copy All Button */}
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={handleCopyAll}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy All Emails
            </Button>
          </div>

          {/* Email Cards */}
          {sequence.emails.map((email, index) => (
            <EmailCard key={index} email={email} index={index} />
          ))}
        </div>
      )}

      {activeTab === 'icebreaker' && sequence && (
        <IcebreakerPanel icebreakerPrompt={sequence.icebreakerPrompt} />
      )}

      {activeTab === 'validation' && sequence && (
        <ValidationChecklist validationResults={sequence.validationResults} />
      )}
    </div>
  )
}
