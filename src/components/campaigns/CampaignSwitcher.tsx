import { useState, useRef, useEffect } from 'react'
import { useCampaigns } from '../../context/CampaignContext'
import { Button, IconButton } from '../ui/Button'
import type { Campaign } from '../../types'

interface CampaignSwitcherProps {
  onOpenDrawer?: () => void
}

export function CampaignSwitcher({ onOpenDrawer }: CampaignSwitcherProps) {
  const {
    campaigns,
    activeCampaign,
    createCampaign,
    loadCampaign,
    renameCampaign,
    getRecentCampaigns,
  } = useCampaigns()

  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const recentCampaigns = getRecentCampaigns(5)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsEditing(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleCreateNew = () => {
    const newCampaign = createCampaign(`Campaign ${campaigns.length + 1}`)
    setIsOpen(false)
    // Start editing the new campaign name
    setEditName(newCampaign.name)
    setIsEditing(true)
  }

  const handleSaveName = () => {
    if (activeCampaign && editName.trim()) {
      renameCampaign(activeCampaign.id, editName.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl
          glass glass-interactive
          text-sm font-medium
          transition-all duration-200
          ${isOpen ? 'border-accent/30' : ''}
        `}
      >
        {/* Folder icon */}
        <svg
          className="w-4 h-4 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>

        {/* Campaign name or placeholder */}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-foreground w-32"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="max-w-[150px] truncate">
            {activeCampaign?.name ?? 'No Campaign'}
          </span>
        )}

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-foreground-muted transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 glass-elevated rounded-xl shadow-lg animate-scale-in z-50">
          {/* Header */}
          <div className="p-3 border-b border-glass-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground-muted">
                Your Campaigns
              </span>
              <span className="text-xs text-foreground-subtle">
                {campaigns.length} total
              </span>
            </div>
          </div>

          {/* Recent campaigns */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {recentCampaigns.length === 0 ? (
              <div className="p-4 text-center text-sm text-foreground-muted">
                No campaigns yet. Create your first one!
              </div>
            ) : (
              <div className="py-1">
                {recentCampaigns.map((campaign) => (
                  <CampaignItem
                    key={campaign.id}
                    campaign={campaign}
                    isActive={campaign.id === activeCampaign?.id}
                    onSelect={() => {
                      loadCampaign(campaign.id)
                      setIsOpen(false)
                    }}
                    onEdit={() => {
                      loadCampaign(campaign.id)
                      setEditName(campaign.name)
                      setIsEditing(true)
                      setIsOpen(false)
                    }}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-2 border-t border-glass-border space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleCreateNew}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Campaign
            </Button>

            {onOpenDrawer && campaigns.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setIsOpen(false)
                  onOpenDrawer()
                }}
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
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Manage All
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Individual campaign item in the dropdown
interface CampaignItemProps {
  campaign: Campaign
  isActive: boolean
  onSelect: () => void
  onEdit: () => void
  formatDate: (date: Date) => string
}

function CampaignItem({
  campaign,
  isActive,
  onSelect,
  onEdit,
  formatDate,
}: CampaignItemProps) {
  return (
    <div
      className={`
        group flex items-center justify-between px-3 py-2 mx-1 rounded-lg
        cursor-pointer transition-colors
        ${isActive ? 'bg-accent/10 text-accent' : 'hover:bg-background-hover'}
      `}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          )}
          <span className="text-sm font-medium truncate">{campaign.name}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-foreground-subtle">
            {formatDate(campaign.updatedAt)}
          </span>
          {campaign.sequences.length > 0 && (
            <span className="text-xs text-foreground-subtle">
              {campaign.sequences.length} sequence
              {campaign.sequences.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Edit button */}
      <IconButton
        label="Edit name"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </IconButton>
    </div>
  )
}
