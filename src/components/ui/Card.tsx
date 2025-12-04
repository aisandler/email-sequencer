import { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={`
        bg-background-card border border-border rounded-xl p-5
        hover:border-border-hover transition-colors
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
}

export function CardHeader({ title, description, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-4">
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-foreground-subtle mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}
