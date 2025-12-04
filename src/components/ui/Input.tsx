import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, ReactNode, useState, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  showCharCount?: boolean
  maxLength?: number
  success?: boolean
  variant?: 'default' | 'glass'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      showCharCount = false,
      maxLength,
      success = false,
      variant = 'default',
      className = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const id = useId()
    const [charCount, setCharCount] = useState(String(value || '').length)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    const baseInputStyles = `
      w-full rounded-xl
      text-foreground placeholder:text-foreground-subtle
      transition-all duration-200
      focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const variantStyles = {
      default: `
        px-3.5 py-2.5
        bg-background border border-border
        focus:border-accent focus:ring-2 focus:ring-accent/20
        ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
        ${success ? 'border-success focus:border-success focus:ring-success/20' : ''}
      `,
      glass: `
        px-3.5 py-2.5
        glass focus-glow
        ${error ? 'border-error' : ''}
        ${success ? 'border-success' : ''}
      `,
    }

    const iconPadding = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground-muted"
          >
            {label}
          </label>
          {showCharCount && maxLength && (
            <span
              className={`text-xs transition-colors ${
                charCount > maxLength ? 'text-error' : 'text-foreground-subtle'
              }`}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        <div className="relative">
          {icon && (
            <div
              className={`
                absolute top-1/2 -translate-y-1/2
                ${iconPosition === 'left' ? 'left-3' : 'right-3'}
                text-foreground-subtle pointer-events-none
              `}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={`
              ${baseInputStyles}
              ${variantStyles[variant]}
              ${iconPadding}
              ${className}
            `}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...props}
          />

          {success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p id={`${id}-error`} className="text-xs text-error flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-foreground-subtle">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  showCharCount?: boolean
  maxLength?: number
  success?: boolean
  variant?: 'default' | 'glass'
  autoResize?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      showCharCount = false,
      maxLength,
      success = false,
      variant = 'default',
      autoResize = false,
      className = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const id = useId()
    const [charCount, setCharCount] = useState(String(value || '').length)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)

      // Auto-resize logic
      if (autoResize) {
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
      }

      onChange?.(e)
    }

    const baseTextareaStyles = `
      w-full rounded-xl resize-none
      text-foreground placeholder:text-foreground-subtle
      transition-all duration-200
      focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
      min-h-[100px]
    `

    const variantStyles = {
      default: `
        px-3.5 py-2.5
        bg-background border border-border
        focus:border-accent focus:ring-2 focus:ring-accent/20
        ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
        ${success ? 'border-success focus:border-success focus:ring-success/20' : ''}
      `,
      glass: `
        px-3.5 py-2.5
        glass focus-glow
        ${error ? 'border-error' : ''}
        ${success ? 'border-success' : ''}
      `,
    }

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground-muted"
          >
            {label}
          </label>
          {showCharCount && maxLength && (
            <span
              className={`text-xs transition-colors ${
                charCount > maxLength ? 'text-error' : 'text-foreground-subtle'
              }`}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={id}
          className={`
            ${baseTextareaStyles}
            ${variantStyles[variant]}
            ${className}
          `}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />

        {error && (
          <p id={`${id}-error`} className="text-xs text-error flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-foreground-subtle">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

// Simple select component with glass styling
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: Array<{ value: string; label: string }>
  variant?: 'default' | 'glass'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, variant = 'default', className = '', ...props }, ref) => {
    const id = useId()

    const baseSelectStyles = `
      w-full rounded-xl appearance-none cursor-pointer
      text-foreground
      transition-all duration-200
      focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const variantStyles = {
      default: `
        px-3.5 py-2.5 pr-10
        bg-background border border-border
        focus:border-accent focus:ring-2 focus:ring-accent/20
        ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
      `,
      glass: `
        px-3.5 py-2.5 pr-10
        glass focus-glow
        ${error ? 'border-error' : ''}
      `,
    }

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground-muted"
        >
          {label}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`${baseSelectStyles} ${variantStyles[variant]} ${className}`}
            aria-invalid={!!error}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="text-xs text-error flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
