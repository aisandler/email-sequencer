// Form Data Types
export interface ICPData {
  role: string
  companySize: string
  industry: string
  painPoints: string[]
  languageTheyUse: string[]
}

export interface OfferData {
  offering: string
  deliverable: string
  timeline: string
  valueProp: string
}

export interface BrandData {
  senderName: string
  companyName: string
  credentials: string
  calendlyLink: string
  website: string
}

export interface SocialProofData {
  metrics: string[]
  results: string[]
  caseStudyReferences: string[]
}

export interface FormData {
  icp: ICPData
  offer: OfferData
  brand: BrandData
  socialProof: SocialProofData
}

// Email Types
export type EmailType = 'value_offer' | 'insight' | 'social_proof' | 'free_resource'

export interface Email {
  day: number
  type: EmailType
  subjectLine: string
  body: string
  wordCount: number
}

export interface EmailSequence {
  emails: Email[]
  icebreakerPrompt: string
  validationResults: ValidationItem[]
  generatedAt: Date
}

// Validation Types
export interface ValidationItem {
  rule: string
  description: string
  passed: boolean
  emailIndex?: number
}

// AI Types
export interface AIConfig {
  apiKey: string
  model: string
  isConfigured: boolean
}

export interface GenerationState {
  isGenerating: boolean
  sequence: EmailSequence | null
  error: string | null
}

// Icebreaker Types
export interface ProspectData {
  email: string
  firstName?: string
  companyName?: string
  websiteContent?: string
}

export interface IcebreakerResult {
  icebreaker: string
  observationSource: string
  painPointConnection: string
}
