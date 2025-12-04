import { useState } from 'react'
import { GlassCard, GlassCardHeader } from '../ui/GlassCard'
import { Input } from '../ui/Input'
import { TextArea } from '../ui/Input'
import { Button } from '../ui/Button'
import type { SequencePerformance, SavedSequence } from '../../types'

interface PerformanceTrackerProps {
  sequence: SavedSequence
  onSave: (performance: Omit<SequencePerformance, 'reportedAt'>) => void
  onCancel?: () => void
}

export function PerformanceTracker({
  sequence,
  onSave,
  onCancel,
}: PerformanceTrackerProps) {
  const existingPerformance = sequence.performance

  const [sentCount, setSentCount] = useState(
    existingPerformance?.sentCount?.toString() ?? ''
  )
  const [openRate, setOpenRate] = useState(
    existingPerformance?.openRate?.toString() ?? ''
  )
  const [replyRate, setReplyRate] = useState(
    existingPerformance?.replyRate?.toString() ?? ''
  )
  const [meetingsBooked, setMeetingsBooked] = useState(
    existingPerformance?.meetingsBooked?.toString() ?? ''
  )
  const [notes, setNotes] = useState(existingPerformance?.notes ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    const performance: Omit<SequencePerformance, 'reportedAt'> = {
      sentCount: parseInt(sentCount) || 0,
      openRate: openRate ? parseFloat(openRate) : null,
      replyRate: replyRate ? parseFloat(replyRate) : null,
      meetingsBooked: parseInt(meetingsBooked) || 0,
      notes,
    }

    onSave(performance)

    // Show success state briefly
    setSaved(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(false)
    }, 1500)
  }

  const hasData =
    sentCount || openRate || replyRate || meetingsBooked || notes

  return (
    <GlassCard variant="elevated" className="animate-slide-up">
      <GlassCardHeader
        title="Track Performance"
        description="Report results to learn what's working"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
      />

      {/* Sequence info */}
      <div className="mb-4 p-3 rounded-lg bg-background-hover/50 text-sm">
        <div className="flex items-center gap-2 text-foreground-muted">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Generated {new Date(sequence.generatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Emails Sent"
          type="number"
          min="0"
          value={sentCount}
          onChange={(e) => setSentCount(e.target.value)}
          placeholder="0"
          hint="Total emails sent with this sequence"
        />

        <Input
          label="Open Rate (%)"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={openRate}
          onChange={(e) => setOpenRate(e.target.value)}
          placeholder="0.0"
          hint="Percentage of emails opened"
        />

        <Input
          label="Reply Rate (%)"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={replyRate}
          onChange={(e) => setReplyRate(e.target.value)}
          placeholder="0.0"
          hint="Percentage of positive replies"
        />

        <Input
          label="Meetings Booked"
          type="number"
          min="0"
          value={meetingsBooked}
          onChange={(e) => setMeetingsBooked(e.target.value)}
          placeholder="0"
          hint="Calls or meetings scheduled"
        />
      </div>

      {/* Notes */}
      <div className="mt-4">
        <TextArea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What worked well? What could be improved? Any patterns you noticed?"
          hint="Qualitative feedback helps identify patterns"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-glass-border">
        <div className="text-sm text-foreground-subtle">
          {existingPerformance && (
            <span>
              Last updated{' '}
              {new Date(existingPerformance.reportedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isSaving}
            success={saved}
            disabled={!hasData}
          >
            {existingPerformance ? 'Update Results' : 'Save Results'}
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

// Compact inline version for showing in sequence cards
interface PerformanceQuickViewProps {
  performance: SequencePerformance
  onEdit?: () => void
}

export function PerformanceQuickView({
  performance,
  onEdit,
}: PerformanceQuickViewProps) {
  const metrics = [
    { label: 'Sent', value: performance.sentCount, icon: '📧' },
    { label: 'Opens', value: performance.openRate ? `${performance.openRate}%` : '—', icon: '👁️' },
    { label: 'Replies', value: performance.replyRate ? `${performance.replyRate}%` : '—', icon: '💬' },
    { label: 'Meetings', value: performance.meetingsBooked, icon: '📅' },
  ]

  return (
    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-success">
          Performance Tracked
        </span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-foreground-muted hover:text-foreground transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {metric.value}
            </div>
            <div className="text-xs text-foreground-muted">{metric.label}</div>
          </div>
        ))}
      </div>

      {performance.notes && (
        <div className="mt-2 pt-2 border-t border-success/10 text-xs text-foreground-muted">
          {performance.notes.length > 100
            ? `${performance.notes.slice(0, 100)}...`
            : performance.notes}
        </div>
      )}
    </div>
  )
}

// Prompt to add performance after generation
interface TrackPerformancePromptProps {
  onTrack: () => void
  onDismiss: () => void
}

export function TrackPerformancePrompt({
  onTrack,
  onDismiss,
}: TrackPerformancePromptProps) {
  return (
    <div className="p-4 rounded-xl glass border border-accent/20 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-foreground">
            Track your results
          </h4>
          <p className="text-sm text-foreground-muted mt-1">
            After sending this sequence, come back and report your results.
            This helps identify what works best.
          </p>

          <div className="flex gap-2 mt-3">
            <Button variant="primary" size="sm" onClick={onTrack}>
              Track Performance
            </Button>
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
