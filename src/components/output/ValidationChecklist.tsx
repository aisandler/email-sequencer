import { Card, CardHeader } from '../ui/Card'
import type { ValidationItem } from '../../types'

interface ValidationChecklistProps {
  validationResults: ValidationItem[]
}

export function ValidationChecklist({ validationResults }: ValidationChecklistProps) {
  const passedCount = validationResults.filter((item) => item.passed).length
  const totalCount = validationResults.length
  const passRate = Math.round((passedCount / totalCount) * 100)

  return (
    <Card>
      <CardHeader
        title="Validation Checklist"
        description={`${passedCount}/${totalCount} rules passed (${passRate}%)`}
        icon={
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        }
      />

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 rounded-full bg-background overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              passRate === 100 ? 'bg-success' : passRate >= 80 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${passRate}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {validationResults.map((item, index) => (
          <div
            key={index}
            className={`
              flex items-start gap-3 p-3 rounded-lg border transition-colors
              ${
                item.passed
                  ? 'bg-success/5 border-success/20'
                  : 'bg-error/5 border-error/20'
              }
            `}
          >
            {item.passed ? (
              <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${item.passed ? 'text-success' : 'text-error'}`}>
                {item.rule}
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">
                {item.description}
              </p>
              {item.emailIndex !== undefined && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-background text-foreground-subtle">
                  Email {item.emailIndex + 1}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
