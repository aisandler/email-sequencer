import { useState } from 'react'
import { ICPBuilder } from '../forms/ICPBuilder'
import { OfferBuilder } from '../forms/OfferBuilder'
import { BrandContext } from '../forms/BrandContext'
import { SocialProof } from '../forms/SocialProof'
import { Button } from '../ui/Button'
import { useFormData } from '../../context/FormDataContext'
import { useAI } from '../../context/AIContext'
import { useToast } from '../../context/ToastContext'
import { generateEmailSequence } from '../../lib/generators/emailGenerator'
import { useGenerationStore } from '../../hooks/useGenerationStore'

export function InputPanel() {
  const { formData, isFormComplete } = useFormData()
  const { config } = useAI()
  const { addToast } = useToast()
  const { isGenerating, setGenerating, setSequence, setError } = useGenerationStore()
  const [expandedSections, setExpandedSections] = useState({
    icp: true,
    offer: true,
    brand: true,
    socialProof: false,
  })

  const handleGenerate = async () => {
    if (!config.isConfigured) {
      addToast('Please configure your OpenRouter API key in Settings', 'error')
      return
    }

    if (!isFormComplete) {
      addToast('Please fill in the required fields', 'error')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const sequence = await generateEmailSequence(formData, config)
      setSequence(sequence)
      addToast('Email sequence generated successfully!', 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed'
      setError(errorMessage)
      addToast(errorMessage, 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Section: ICP */}
      <div className="animate-fade-in">
        <ICPBuilder />
      </div>

      {/* Section: Offer */}
      <div className="animate-fade-in delay-100">
        <OfferBuilder />
      </div>

      {/* Section: Brand */}
      <div className="animate-fade-in delay-200">
        <BrandContext />
      </div>

      {/* Section: Social Proof (Collapsible) */}
      <div className="animate-fade-in delay-300">
        <button
          onClick={() =>
            setExpandedSections((prev) => ({ ...prev, socialProof: !prev.socialProof }))
          }
          className="w-full flex items-center justify-between p-4 bg-background-card border border-border rounded-xl hover:border-border-hover transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-display text-base font-semibold text-foreground">
                Social Proof
              </h3>
              <p className="text-sm text-foreground-subtle">Optional but recommended</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-foreground-muted transition-transform ${
              expandedSections.socialProof ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.socialProof && (
          <div className="mt-2">
            <SocialProof />
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="pt-4 animate-fade-in delay-400">
        <Button
          onClick={handleGenerate}
          loading={isGenerating}
          disabled={!isFormComplete || !config.isConfigured}
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            'Generating Sequence...'
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Email Sequence
            </>
          )}
        </Button>

        {!config.isConfigured && (
          <p className="mt-2 text-sm text-center text-foreground-subtle">
            Configure your API key in Settings to enable generation
          </p>
        )}
      </div>
    </div>
  )
}
