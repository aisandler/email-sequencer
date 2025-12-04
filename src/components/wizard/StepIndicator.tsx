import { ReactNode } from 'react'

export interface Step {
  id: string
  title: string
  description?: string
  icon: ReactNode
  isOptional?: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  completedSteps: Set<number>
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop view - horizontal */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border mx-10" />

        {/* Progress line fill */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-accent mx-10 transition-all duration-500 ease-out"
          style={{
            width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 80px)`,
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index)
          const isCurrent = index === currentStep
          const isClickable = isCompleted || index <= currentStep

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={`
                relative z-10 flex flex-col items-center gap-2
                transition-all duration-300
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              {/* Step circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 ease-out
                  ${
                    isCompleted
                      ? 'bg-success text-white shadow-lg shadow-success/25'
                      : isCurrent
                      ? 'bg-gradient-accent text-white shadow-lg shadow-accent/25 animate-glow-pulse'
                      : 'glass text-foreground-muted'
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="w-5 h-5">{step.icon}</span>
                )}
              </div>

              {/* Step title */}
              <div className="text-center">
                <p
                  className={`
                    text-sm font-medium transition-colors
                    ${isCurrent ? 'text-foreground' : 'text-foreground-muted'}
                  `}
                >
                  {step.title}
                </p>
                {step.isOptional && (
                  <span className="text-xs text-foreground-subtle">Optional</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Mobile view - compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-foreground-muted">
            {steps[currentStep].title}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-background-card rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-accent rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index)
            const isCurrent = index === currentStep

            return (
              <button
                key={step.id}
                onClick={() => (isCompleted || index <= currentStep) && onStepClick?.(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-success'
                      : isCurrent
                      ? 'bg-accent w-6'
                      : 'bg-border'
                  }
                `}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Compact inline step indicator for smaller spaces
interface CompactStepIndicatorProps {
  current: number
  total: number
  label?: string
}

export function CompactStepIndicator({ current, total, label }: CompactStepIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`
              h-1 rounded-full transition-all duration-300
              ${index < current ? 'w-4 bg-accent' : index === current ? 'w-6 bg-accent' : 'w-2 bg-border'}
            `}
          />
        ))}
      </div>
      {label && (
        <span className="text-xs text-foreground-muted">{label}</span>
      )}
    </div>
  )
}
