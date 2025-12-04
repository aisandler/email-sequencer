import { ReactNode, useEffect, useState } from 'react'

interface StepContentProps {
  children: ReactNode
  isActive: boolean
  direction?: 'left' | 'right'
  className?: string
}

export function StepContent({
  children,
  isActive,
  direction = 'right',
  className = '',
}: StepContentProps) {
  const [shouldRender, setShouldRender] = useState(isActive)
  const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting'>(
    isActive ? 'visible' : 'exiting'
  )

  useEffect(() => {
    if (isActive) {
      setShouldRender(true)
      // Small delay to trigger CSS animation
      requestAnimationFrame(() => {
        setAnimationState('entering')
        setTimeout(() => setAnimationState('visible'), 300)
      })
    } else {
      setAnimationState('exiting')
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!shouldRender) return null

  const getTransform = () => {
    if (animationState === 'entering') {
      return direction === 'right' ? 'translateX(20px)' : 'translateX(-20px)'
    }
    if (animationState === 'exiting') {
      return direction === 'right' ? 'translateX(-20px)' : 'translateX(20px)'
    }
    return 'translateX(0)'
  }

  return (
    <div
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        opacity: animationState === 'visible' ? 1 : 0,
        transform: getTransform(),
      }}
    >
      {children}
    </div>
  )
}

// Simpler variant that just fades
interface FadeContentProps {
  children: ReactNode
  isActive: boolean
  className?: string
}

export function FadeContent({ children, isActive, className = '' }: FadeContentProps) {
  const [shouldRender, setShouldRender] = useState(isActive)

  useEffect(() => {
    if (isActive) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!shouldRender) return null

  return (
    <div
      className={`
        transition-opacity duration-300
        ${isActive ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Staggered children animation
interface StaggeredChildrenProps {
  children: ReactNode[]
  delay?: number
  className?: string
}

export function StaggeredChildren({ children, delay = 100, className = '' }: StaggeredChildrenProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-slide-up"
          style={{ animationDelay: `${index * delay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
