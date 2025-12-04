import { Card, CardHeader } from '../ui/Card'
import { Input } from '../ui/Input'
import { TagInput } from '../ui/TagInput'
import { useFormData } from '../../context/FormDataContext'

export function ICPBuilder() {
  const { formData, updateICP } = useFormData()
  const { icp } = formData

  return (
    <Card>
      <CardHeader
        title="ICP Builder"
        description="Define your ideal customer profile"
        icon={
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      <div className="space-y-4">
        <Input
          label="Target Role"
          value={icp.role}
          onChange={(e) => updateICP({ role: e.target.value })}
          placeholder="VP of Sales, Founder, Head of Growth..."
        />

        <Input
          label="Company Size"
          value={icp.companySize}
          onChange={(e) => updateICP({ companySize: e.target.value })}
          placeholder="10-50 employees, Series A, Enterprise..."
        />

        <Input
          label="Industry"
          value={icp.industry}
          onChange={(e) => updateICP({ industry: e.target.value })}
          placeholder="B2B SaaS, E-commerce, Fintech..."
        />

        <TagInput
          label="Pain Points"
          tags={icp.painPoints}
          onChange={(painPoints) => updateICP({ painPoints })}
          placeholder="What problems do they face?"
        />

        <TagInput
          label="Language They Use"
          tags={icp.languageTheyUse}
          onChange={(languageTheyUse) => updateICP({ languageTheyUse })}
          placeholder="ARR, pipeline, CAC, churn..."
        />
      </div>
    </Card>
  )
}
