import { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`shimmer rounded-lg ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

// Pre-configured skeleton variants
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return <Skeleton className={`${sizes[size]} rounded-full`} />
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-xl p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

// Email card skeleton
export function SkeletonEmailCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-xl p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Subject line */}
      <Skeleton className="h-5 w-3/4" />

      {/* Body lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Gap */}
      <div className="h-2" />

      {/* More body */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

// Email sequence skeleton (4 cards)
export function SkeletonEmailSequence() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-slide-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <SkeletonEmailCard />
        </div>
      ))}
    </div>
  )
}

// Form field skeleton
export function SkeletonField({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  )
}

// Form skeleton
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <SkeletonField key={i} />
      ))}
    </div>
  )
}

// Analytics card skeleton
export function SkeletonMetricCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-xl p-4 space-y-2 ${className}`}>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

// Chart skeleton
export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-xl p-5 ${className}`}>
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="flex items-end gap-2 h-40">
        {[40, 65, 45, 80, 55, 70, 50].map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}
