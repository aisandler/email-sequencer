import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground-muted">
        {label}
      </label>
      <input
        className={`
          w-full px-3.5 py-2.5 rounded-lg
          bg-background border border-border
          text-foreground placeholder:text-foreground-subtle
          focus:outline-none focus:border-accent
          transition-colors
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground-muted">
        {label}
      </label>
      <textarea
        className={`
          w-full px-3.5 py-2.5 rounded-lg resize-none
          bg-background border border-border
          text-foreground placeholder:text-foreground-subtle
          focus:outline-none focus:border-accent
          transition-colors min-h-[80px]
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
