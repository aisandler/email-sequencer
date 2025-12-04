import { Card, CardHeader } from '../ui/Card'
import { Input } from '../ui/Input'
import { useFormData } from '../../context/FormDataContext'

export function BrandContext() {
  const { formData, updateBrand } = useFormData()
  const { brand } = formData

  return (
    <Card>
      <CardHeader
        title="Brand Context"
        description="Your sender information"
        icon={
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <div className="space-y-4">
        <Input
          label="Your Name"
          value={brand.senderName}
          onChange={(e) => updateBrand({ senderName: e.target.value })}
          placeholder="Adam Sandler"
        />

        <Input
          label="Company Name"
          value={brand.companyName}
          onChange={(e) => updateBrand({ companyName: e.target.value })}
          placeholder="One Button Agency"
        />

        <Input
          label="Credentials"
          value={brand.credentials}
          onChange={(e) => updateBrand({ credentials: e.target.value })}
          placeholder="Founder, Growth Expert, 10+ years..."
        />

        <Input
          label="Calendly Link"
          value={brand.calendlyLink}
          onChange={(e) => updateBrand({ calendlyLink: e.target.value })}
          placeholder="calendly.com/yourname"
        />

        <Input
          label="Website"
          value={brand.website}
          onChange={(e) => updateBrand({ website: e.target.value })}
          placeholder="yourwebsite.com"
        />
      </div>
    </Card>
  )
}
