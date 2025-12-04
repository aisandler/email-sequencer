import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { useToast } from '../../context/ToastContext'
import type { Email } from '../../types'

interface EmailCardProps {
  email: Email
  index: number
}

const DAY_LABELS = ['Day 0 (Initial)', 'Day 3', 'Day 6', 'Day 9']
const TYPE_LABELS: Record<string, string> = {
  value_offer: 'Value Offer',
  insight: 'Insight/Data',
  social_proof: 'Social Proof',
  free_resource: 'Free Resource',
}

export function EmailCard({ email, index }: EmailCardProps) {
  const { copy, copied } = useCopyToClipboard()
  const { addToast } = useToast()
  const [showRaw, setShowRaw] = useState(false)

  const handleCopyBody = async () => {
    const success = await copy(email.body)
    if (success) {
      addToast('Email body copied', 'success')
    }
  }

  const handleCopySubject = async () => {
    const success = await copy(email.subjectLine)
    if (success) {
      addToast('Subject line copied', 'success')
    }
  }

  const getWordCountColor = (count: number) => {
    if (count < 50) return 'text-warning'
    if (count > 80) return 'text-error'
    return 'text-success'
  }

  return (
    <Card className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-accent text-white text-xs font-medium">
            {DAY_LABELS[index]}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-accent-subtle text-accent text-xs font-medium">
            {TYPE_LABELS[email.type]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${getWordCountColor(email.wordCount)}`}>
            {email.wordCount} words
          </span>
        </div>
      </div>

      {/* Subject Line */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
            Subject Line
          </span>
          <Button variant="ghost" size="sm" onClick={handleCopySubject}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
        </div>
        <div className="px-3 py-2 rounded-lg bg-background border border-border">
          <code className="text-sm text-foreground">{email.subjectLine}</code>
        </div>
      </div>

      {/* Email Body */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
            Email Body
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="text-xs text-foreground-muted hover:text-foreground transition-colors"
            >
              {showRaw ? 'Preview' : 'Raw'}
            </button>
            <Button variant="ghost" size="sm" onClick={handleCopyBody}>
              {copied ? (
                <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </Button>
          </div>
        </div>
        <div className="px-4 py-3 rounded-lg bg-background border border-border">
          {showRaw ? (
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
              {email.body}
            </pre>
          ) : (
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {email.body.split('\n').map((line, i) => (
                <p key={i} className={line === '' ? 'h-3' : ''}>
                  {line.includes('{{') ? (
                    <span>
                      {line.split(/(\{\{[^}]+\}\})/).map((part, j) =>
                        part.startsWith('{{') ? (
                          <span key={j} className="px-1 py-0.5 rounded bg-accent-subtle text-accent text-xs font-mono">
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </span>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
