import { Card, CardHeader } from '../ui/Card'
import { TagInput } from '../ui/TagInput'
import { useFormData } from '../../context/FormDataContext'

export function SocialProof() {
  const { formData, updateSocialProof } = useFormData()
  const { socialProof } = formData

  return (
    <Card>
      <CardHeader
        title="Social Proof"
        description="Results and credibility (no company names)"
        icon={
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        }
      />

      <div className="space-y-4">
        <TagInput
          label="Key Metrics"
          tags={socialProof.metrics}
          onChange={(metrics) => updateSocialProof({ metrics })}
          placeholder="3x reply rate, 50% increase..."
        />

        <TagInput
          label="Results Achieved"
          tags={socialProof.results}
          onChange={(results) => updateSocialProof({ results })}
          placeholder="Went from 5 to 30 replies/day..."
        />

        <TagInput
          label="Case Study References"
          tags={socialProof.caseStudyReferences}
          onChange={(caseStudyReferences) => updateSocialProof({ caseStudyReferences })}
          placeholder="Similar SaaS company, Series B startup..."
        />
      </div>
    </Card>
  )
}
