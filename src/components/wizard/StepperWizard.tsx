import { ReactNode, useState, useCallback, useEffect } from 'react'
import { StepIndicator, Step } from './StepIndicator'
import { StepContent } from './StepContent'
import { GlassCard } from '../ui/GlassCard'
import { Button } from '../ui/Button'

export interface WizardStep extends Step {
  component: ReactNode
  validationFn?: () => boolean
  onEnter?: () => void
  onLeave?: () => void
}

interface StepperWizardProps {
  steps: WizardStep[]
  onComplete: () => void
  onStepChange?: (step: number) => void
  showPreview?: boolean
  previewComponent?: ReactNode
  completeButtonText?: string
  completeButtonLoading?: boolean
}

export function StepperWizard({
  steps,
  onComplete,
  onStepChange,
  showPreview = false,
  previewComponent,
  completeButtonText = 'Generate Sequence',
  completeButtonLoading = false,
}: StepperWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const currentStepData = steps[currentStep]

  // Mark step as completed when validation passes
  useEffect(() => {
    const isValid = currentStepData.validationFn?.() ?? true
    if (isValid && !completedSteps.has(currentStep)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
    }
  }, [currentStep, currentStepData, completedSteps])

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex === currentStep) return

      // Call onLeave for current step
      steps[currentStep].onLeave?.()

      setDirection(stepIndex > currentStep ? 'right' : 'left')
      setCurrentStep(stepIndex)
      onStepChange?.(stepIndex)

      // Call onEnter for new step
      steps[stepIndex].onEnter?.()
    },
    [currentStep, steps, onStepChange]
  )

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete()
    } else {
      // Mark current step as completed
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      goToStep(currentStep + 1)
    }
  }, [isLastStep, onComplete, currentStep, goToStep])

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      goToStep(currentStep - 1)
    }
  }, [isFirstStep, currentStep, goToStep])

  const handleStepClick = useCallback(
    (index: number) => {
      // Only allow clicking on completed steps or the next step
      if (completedSteps.has(index) || index <= currentStep) {
        goToStep(index)
      }
    },
    [completedSteps, currentStep, goToStep]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        handleBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handleBack])

  const canProceed = currentStepData.validationFn?.() ?? true

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {/* Content area */}
      <div className={`${showPreview ? 'grid lg:grid-cols-2 gap-6' : ''}`}>
        {/* Step content */}
        <GlassCard variant="elevated" className="min-h-[400px]">
          <div className="relative">
            {steps.map((step, index) => (
              <StepContent
                key={step.id}
                isActive={index === currentStep}
                direction={direction}
              >
                {step.component}
              </StepContent>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-glass-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstStep}
              className={isFirstStep ? 'invisible' : ''}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Button>

            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              {currentStepData.isOptional && (
                <button
                  onClick={handleNext}
                  className="text-accent hover:underline"
                >
                  Skip this step
                </button>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed && !currentStepData.isOptional}
              loading={isLastStep && completeButtonLoading}
            >
              {isLastStep ? (
                <>
                  {completeButtonText}
                  <svg
                    className="w-4 h-4 ml-2"
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
                </>
              ) : (
                <>
                  Continue
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </GlassCard>

        {/* Preview panel */}
        {showPreview && previewComponent && (
          <GlassCard variant="default" className="lg:sticky lg:top-8 lg:self-start">
            {previewComponent}
          </GlassCard>
        )}
      </div>
    </div>
  )
}

// Simpler wizard for modals/smaller contexts
interface MiniWizardProps {
  steps: Array<{
    id: string
    title: string
    content: ReactNode
  }>
  onComplete: () => void
  onCancel?: () => void
}

export function MiniWizard({ steps, onComplete, onCancel }: MiniWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${index === currentStep ? 'w-6 bg-accent' : 'w-1.5 bg-border'}
            `}
          />
        ))}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-center">
        {steps[currentStep].title}
      </h3>

      {/* Content */}
      <div className="py-4">{steps[currentStep].content}</div>

      {/* Actions */}
      <div className="flex justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            if (currentStep === 0) {
              onCancel?.()
            } else {
              setCurrentStep((s) => s - 1)
            }
          }}
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            if (isLastStep) {
              onComplete()
            } else {
              setCurrentStep((s) => s + 1)
            }
          }}
        >
          {isLastStep ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
