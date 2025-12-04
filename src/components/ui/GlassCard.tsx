import { ReactNode, CSSProperties, forwardRef } from 'react'

export interface GlassCardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'solid'
  interactive?: boolean
  glow?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = 'default',
      interactive = false,
      glow = false,
      className = '',
      style,
      onClick,
    },
    ref
  ) => {
    const variantClasses = {
      default: 'glass',
      elevated: 'glass-elevated',
      solid: 'glass-solid',
    }

    return (
      <div
        ref={ref}
        className={`
          ${variantClasses[variant]}
          rounded-xl p-5
          ${interactive ? 'glass-interactive cursor-pointer' : ''}
          ${glow ? 'glass-glow' : ''}
          ${className}
        `}
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export interface GlassCardHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  step?: number
  totalSteps?: number
}

export function GlassCardHeader({
  title,
  description,
  icon,
  action,
  step,
  totalSteps,
}: GlassCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center flex-shrink-0 shadow-lg">
            <div className="text-white">{icon}</div>
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {title}
            </h3>
            {step !== undefined && totalSteps !== undefined && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-subtle text-accent font-medium">
                {step}/{totalSteps}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-foreground-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

export interface GlassCardFooterProps {
  children: ReactNode
  className?: string
}

export function GlassCardFooter({ children, className = '' }: GlassCardFooterProps) {
  return (
    <div
      className={`
        mt-4 pt-4 border-t border-glass-border
        flex items-center justify-between gap-3
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export interface GlassDividerProps {
  className?: string
}

export function GlassDivider({ className = '' }: GlassDividerProps) {
  return (
    <div
      className={`
        h-px w-full my-4
        bg-gradient-to-r from-transparent via-glass-border to-transparent
        ${className}
      `}
    />
  )
}
