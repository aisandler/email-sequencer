import { createContext, useContext, useCallback, ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { FormData, ICPData, OfferData, BrandData, SocialProofData } from '../types'

interface FormDataContextType {
  formData: FormData
  updateICP: (data: Partial<ICPData>) => void
  updateOffer: (data: Partial<OfferData>) => void
  updateBrand: (data: Partial<BrandData>) => void
  updateSocialProof: (data: Partial<SocialProofData>) => void
  clearFormData: () => void
  isFormComplete: boolean
}

const FormDataContext = createContext<FormDataContextType | null>(null)

const DEFAULT_FORM_DATA: FormData = {
  icp: {
    role: '',
    companySize: '',
    industry: '',
    painPoints: [],
    languageTheyUse: [],
  },
  offer: {
    offering: '',
    deliverable: '',
    timeline: '',
    valueProp: '',
  },
  brand: {
    senderName: '',
    companyName: '',
    credentials: '',
    calendlyLink: '',
    website: '',
  },
  socialProof: {
    metrics: [],
    results: [],
    caseStudyReferences: [],
  },
}

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData, clearFormData] = useLocalStorage<FormData>(
    'email-sequencer-form-data',
    DEFAULT_FORM_DATA
  )

  const updateICP = useCallback(
    (data: Partial<ICPData>) => {
      setFormData((prev) => ({
        ...prev,
        icp: { ...prev.icp, ...data },
      }))
    },
    [setFormData]
  )

  const updateOffer = useCallback(
    (data: Partial<OfferData>) => {
      setFormData((prev) => ({
        ...prev,
        offer: { ...prev.offer, ...data },
      }))
    },
    [setFormData]
  )

  const updateBrand = useCallback(
    (data: Partial<BrandData>) => {
      setFormData((prev) => ({
        ...prev,
        brand: { ...prev.brand, ...data },
      }))
    },
    [setFormData]
  )

  const updateSocialProof = useCallback(
    (data: Partial<SocialProofData>) => {
      setFormData((prev) => ({
        ...prev,
        socialProof: { ...prev.socialProof, ...data },
      }))
    },
    [setFormData]
  )

  // Check if minimum required fields are filled
  const isFormComplete =
    formData.icp.role.length > 0 &&
    formData.icp.industry.length > 0 &&
    formData.offer.offering.length > 0 &&
    formData.offer.valueProp.length > 0 &&
    formData.brand.senderName.length > 0

  return (
    <FormDataContext.Provider
      value={{
        formData,
        updateICP,
        updateOffer,
        updateBrand,
        updateSocialProof,
        clearFormData,
        isFormComplete,
      }}
    >
      {children}
    </FormDataContext.Provider>
  )
}

export function useFormData() {
  const context = useContext(FormDataContext)
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return context
}
