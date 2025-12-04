import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  success?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      success = false,
      icon,
      iconPosition = 'left',
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-xl
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      btn-ripple
    `

    const variants = {
      primary: `
        bg-gradient-accent text-white font-semibold
        hover:shadow-lg hover:shadow-accent/25
        active:scale-[0.98] active:shadow-none
        ${success ? 'animate-success-pop bg-success hover:shadow-success/25' : ''}
      `,
      secondary: `
        glass glass-interactive
        text-foreground
        active:scale-[0.98]
      `,
      ghost: `
        text-foreground-muted
        hover:text-foreground hover:bg-background-hover
        active:scale-[0.98]
      `,
      glass: `
        glass glass-interactive
        text-foreground
        hover:border-accent/30
        active:scale-[0.98]
      `,
      danger: `
        bg-error/10 border border-error/20 text-error
        hover:bg-error/20 hover:border-error/30
        active:scale-[0.98]
      `,
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3.5 text-base gap-2.5',
      icon: 'p-2.5',
    }

    const iconSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      icon: 'w-5 h-5',
    }

    const LoadingSpinner = () => (
      <svg
        className={`animate-spin ${iconSizes[size]}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    const SuccessCheck = () => (
      <svg
        className={`${iconSizes[size]} text-white`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    )

    const renderIcon = () => {
      if (loading) return <LoadingSpinner />
      if (success) return <SuccessCheck />
      if (icon) return <span className={iconSizes[size]}>{icon}</span>
      return null
    }

    const showLeftIcon = (icon || loading || success) && iconPosition === 'left'
    const showRightIcon = icon && iconPosition === 'right' && !loading && !success

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {showLeftIcon && renderIcon()}
        {size !== 'icon' && <span>{children}</span>}
        {size === 'icon' && !loading && !success && children}
        {showRightIcon && renderIcon()}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Icon button variant for common actions
interface IconButtonProps extends Omit<ButtonProps, 'size' | 'children'> {
  label: string
  children: ReactNode
}

export function IconButton({
  label,
  children,
  variant = 'ghost',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      className={`rounded-lg ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </Button>
  )
}
