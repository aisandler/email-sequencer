import { Card, CardHeader } from '../ui/Card'
import { Input, TextArea } from '../ui/Input'
import { useFormData } from '../../context/FormDataContext'

export function OfferBuilder() {
  const { formData, updateOffer } = useFormData()
  const { offer } = formData

  return (
    <Card>
      <CardHeader
        title="Offer Builder"
        description="What value are you providing?"
        icon={
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="space-y-4">
        <Input
          label="What You're Offering"
          value={offer.offering}
          onChange={(e) => updateOffer({ offering: e.target.value })}
          placeholder="Cold email audit, sales playbook, growth framework..."
        />

        <Input
          label="Tangible Deliverable"
          value={offer.deliverable}
          onChange={(e) => updateOffer({ deliverable: e.target.value })}
          placeholder="10-minute audit, PDF playbook, video walkthrough..."
        />

        <Input
          label="Timeline"
          value={offer.timeline}
          onChange={(e) => updateOffer({ timeline: e.target.value })}
          placeholder="Takes 10 minutes to implement, 2-week results..."
        />

        <TextArea
          label="Value Proposition"
          value={offer.valueProp}
          onChange={(e) => updateOffer({ valueProp: e.target.value })}
          placeholder="The core benefit they'll get..."
          rows={3}
        />
      </div>
    </Card>
  )
}
