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

// Campaign Types
export interface Campaign {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  formData: FormData
  sequences: SavedSequence[]
  tags: string[]
}

export interface SavedSequence {
  id: string
  campaignId: string
  emails: Email[]
  icebreakerPrompt: string
  validationResults: ValidationItem[]
  generatedAt: Date
  modelUsed: string
  performance?: SequencePerformance
}

export interface SequencePerformance {
  sentCount: number
  openRate: number | null
  replyRate: number | null
  meetingsBooked: number
  notes: string
  reportedAt: Date
}

// Campaign Store
export interface CampaignStore {
  campaigns: Campaign[]
  activeCampaignId: string | null
}

// Analytics Types
export interface AggregateMetrics {
  totalSequences: number
  totalEmailsSent: number
  averageOpenRate: number | null
  averageReplyRate: number | null
  totalMeetingsBooked: number
  topPerformingIndustry: string | null
  topPerformingPainPoint: string | null
}

export interface PerformanceInsight {
  id: string
  type: 'success' | 'improvement' | 'trend'
  title: string
  description: string
  metric?: number
  comparisonMetric?: number
}
