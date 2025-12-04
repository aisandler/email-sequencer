import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import type {
  Campaign,
  CampaignStore,
  FormData,
  SavedSequence,
  SequencePerformance,
  EmailSequence,
} from '../types'

const STORAGE_KEY = 'email-sequencer-campaigns'
const MAX_CAMPAIGNS = 50

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Default empty form data
const defaultFormData: FormData = {
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

interface CampaignContextType {
  // State
  campaigns: Campaign[]
  activeCampaign: Campaign | null
  isLoading: boolean

  // Campaign operations
  createCampaign: (name: string, formData?: FormData) => Campaign
  loadCampaign: (id: string) => void
  saveCampaign: (formData: FormData) => void
  duplicateCampaign: (id: string) => Campaign | null
  deleteCampaign: (id: string) => void
  renameCampaign: (id: string, name: string) => void
  addTag: (id: string, tag: string) => void
  removeTag: (id: string, tag: string) => void

  // Sequence operations
  saveSequence: (
    campaignId: string,
    sequence: EmailSequence,
    modelUsed: string
  ) => SavedSequence
  updatePerformance: (
    sequenceId: string,
    performance: Omit<SequencePerformance, 'reportedAt'>
  ) => void
  deleteSequence: (sequenceId: string) => void

  // Import/Export
  exportCampaign: (id: string) => string
  importCampaign: (json: string) => Campaign | null
  exportAllCampaigns: () => string

  // Helpers
  getCampaignById: (id: string) => Campaign | undefined
  getSequenceById: (id: string) => SavedSequence | undefined
  getRecentCampaigns: (limit?: number) => Campaign[]
}

const CampaignContext = createContext<CampaignContextType | null>(null)

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<CampaignStore>({
    campaigns: [],
    activeCampaignId: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CampaignStore

        // Convert date strings back to Date objects
        const campaigns = parsed.campaigns.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          sequences: c.sequences.map((s) => ({
            ...s,
            generatedAt: new Date(s.generatedAt),
            performance: s.performance
              ? { ...s.performance, reportedAt: new Date(s.performance.reportedAt) }
              : undefined,
          })),
        }))

        setStore({
          campaigns,
          activeCampaignId: parsed.activeCampaignId,
        })
      }
    } catch (error) {
      console.warn('Failed to load campaigns from localStorage:', error)
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage when store changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
      } catch (error) {
        console.warn('Failed to save campaigns to localStorage:', error)
      }
    }
  }, [store, isLoading])

  // Get active campaign
  const activeCampaign =
    store.campaigns.find((c) => c.id === store.activeCampaignId) ?? null

  // Create a new campaign
  const createCampaign = useCallback(
    (name: string, formData?: FormData): Campaign => {
      if (store.campaigns.length >= MAX_CAMPAIGNS) {
        // Remove oldest campaign
        const sortedCampaigns = [...store.campaigns].sort(
          (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
        )
        const oldestId = sortedCampaigns[0].id
        setStore((prev) => ({
          ...prev,
          campaigns: prev.campaigns.filter((c) => c.id !== oldestId),
        }))
      }

      const campaign: Campaign = {
        id: generateId(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
        formData: formData ?? defaultFormData,
        sequences: [],
        tags: [],
      }

      setStore((prev) => ({
        campaigns: [...prev.campaigns, campaign],
        activeCampaignId: campaign.id,
      }))

      return campaign
    },
    [store.campaigns.length]
  )

  // Load an existing campaign
  const loadCampaign = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      activeCampaignId: id,
    }))
  }, [])

  // Save form data to active campaign
  const saveCampaign = useCallback((formData: FormData) => {
    setStore((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) =>
        c.id === prev.activeCampaignId
          ? { ...c, formData, updatedAt: new Date() }
          : c
      ),
    }))
  }, [])

  // Duplicate a campaign
  const duplicateCampaign = useCallback(
    (id: string): Campaign | null => {
      const original = store.campaigns.find((c) => c.id === id)
      if (!original) return null

      const duplicate: Campaign = {
        ...original,
        id: generateId(),
        name: `${original.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
        sequences: [], // Don't copy sequences
      }

      setStore((prev) => ({
        campaigns: [...prev.campaigns, duplicate],
        activeCampaignId: duplicate.id,
      }))

      return duplicate
    },
    [store.campaigns]
  )

  // Delete a campaign
  const deleteCampaign = useCallback((id: string) => {
    setStore((prev) => ({
      campaigns: prev.campaigns.filter((c) => c.id !== id),
      activeCampaignId: prev.activeCampaignId === id ? null : prev.activeCampaignId,
    }))
  }, [])

  // Rename a campaign
  const renameCampaign = useCallback((id: string, name: string) => {
    setStore((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) =>
        c.id === id ? { ...c, name, updatedAt: new Date() } : c
      ),
    }))
  }, [])

  // Add tag to campaign
  const addTag = useCallback((id: string, tag: string) => {
    setStore((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) =>
        c.id === id && !c.tags.includes(tag)
          ? { ...c, tags: [...c.tags, tag], updatedAt: new Date() }
          : c
      ),
    }))
  }, [])

  // Remove tag from campaign
  const removeTag = useCallback((id: string, tag: string) => {
    setStore((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) =>
        c.id === id
          ? { ...c, tags: c.tags.filter((t) => t !== tag), updatedAt: new Date() }
          : c
      ),
    }))
  }, [])

  // Save a generated sequence to a campaign
  const saveSequence = useCallback(
    (
      campaignId: string,
      sequence: EmailSequence,
      modelUsed: string
    ): SavedSequence => {
      const savedSequence: SavedSequence = {
        id: generateId(),
        campaignId,
        emails: sequence.emails,
        icebreakerPrompt: sequence.icebreakerPrompt,
        validationResults: sequence.validationResults,
        generatedAt: sequence.generatedAt,
        modelUsed,
      }

      setStore((prev) => ({
        ...prev,
        campaigns: prev.campaigns.map((c) =>
          c.id === campaignId
            ? {
                ...c,
                sequences: [...c.sequences, savedSequence],
                updatedAt: new Date(),
              }
            : c
        ),
      }))

      return savedSequence
    },
    []
  )

  // Update performance data for a sequence
  const updatePerformance = useCallback(
    (sequenceId: string, performance: Omit<SequencePerformance, 'reportedAt'>) => {
      const fullPerformance: SequencePerformance = {
        ...performance,
        reportedAt: new Date(),
      }

      setStore((prev) => ({
        ...prev,
        campaigns: prev.campaigns.map((c) => ({
          ...c,
          sequences: c.sequences.map((s) =>
            s.id === sequenceId ? { ...s, performance: fullPerformance } : s
          ),
          updatedAt:
            c.sequences.some((s) => s.id === sequenceId)
              ? new Date()
              : c.updatedAt,
        })),
      }))
    },
    []
  )

  // Delete a sequence
  const deleteSequence = useCallback((sequenceId: string) => {
    setStore((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) => ({
        ...c,
        sequences: c.sequences.filter((s) => s.id !== sequenceId),
        updatedAt:
          c.sequences.some((s) => s.id === sequenceId)
            ? new Date()
            : c.updatedAt,
      })),
    }))
  }, [])

  // Export a single campaign as JSON
  const exportCampaign = useCallback(
    (id: string): string => {
      const campaign = store.campaigns.find((c) => c.id === id)
      if (!campaign) return ''
      return JSON.stringify(campaign, null, 2)
    },
    [store.campaigns]
  )

  // Import a campaign from JSON
  const importCampaign = useCallback((json: string): Campaign | null => {
    try {
      const parsed = JSON.parse(json) as Campaign
      const campaign: Campaign = {
        ...parsed,
        id: generateId(), // Generate new ID to avoid conflicts
        createdAt: new Date(),
        updatedAt: new Date(),
        sequences: parsed.sequences?.map((s) => ({
          ...s,
          id: generateId(),
          campaignId: '', // Will be set below
          generatedAt: new Date(s.generatedAt),
          performance: s.performance
            ? { ...s.performance, reportedAt: new Date(s.performance.reportedAt) }
            : undefined,
        })) ?? [],
      }

      // Update sequence campaignIds
      campaign.sequences = campaign.sequences.map((s) => ({
        ...s,
        campaignId: campaign.id,
      }))

      setStore((prev) => ({
        campaigns: [...prev.campaigns, campaign],
        activeCampaignId: campaign.id,
      }))

      return campaign
    } catch (error) {
      console.error('Failed to import campaign:', error)
      return null
    }
  }, [])

  // Export all campaigns
  const exportAllCampaigns = useCallback((): string => {
    return JSON.stringify(store.campaigns, null, 2)
  }, [store.campaigns])

  // Get campaign by ID
  const getCampaignById = useCallback(
    (id: string) => store.campaigns.find((c) => c.id === id),
    [store.campaigns]
  )

  // Get sequence by ID
  const getSequenceById = useCallback(
    (id: string) => {
      for (const campaign of store.campaigns) {
        const sequence = campaign.sequences.find((s) => s.id === id)
        if (sequence) return sequence
      }
      return undefined
    },
    [store.campaigns]
  )

  // Get recent campaigns sorted by updatedAt
  const getRecentCampaigns = useCallback(
    (limit = 5) => {
      return [...store.campaigns]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, limit)
    },
    [store.campaigns]
  )

  return (
    <CampaignContext.Provider
      value={{
        campaigns: store.campaigns,
        activeCampaign,
        isLoading,
        createCampaign,
        loadCampaign,
        saveCampaign,
        duplicateCampaign,
        deleteCampaign,
        renameCampaign,
        addTag,
        removeTag,
        saveSequence,
        updatePerformance,
        deleteSequence,
        exportCampaign,
        importCampaign,
        exportAllCampaigns,
        getCampaignById,
        getSequenceById,
        getRecentCampaigns,
      }}
    >
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaigns() {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}
