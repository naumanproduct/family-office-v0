"use client"

import * as React from "react"

interface TypableAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: (value: string) => void
  showButtons?: boolean
  submitLabel?: string
}

export function TypableArea({
  value,
  onChange,
  placeholder = "Add notes...",
  onSubmit,
  showButtons = false,
  submitLabel = "Add comment",
}: TypableAreaProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit(value)
      onChange("")
      setIsFocused(false)
    }
  }

  const handleCancel = () => {
    onChange("")
    setIsFocused(false)
  }

  return (
    <div className="space-y-3">
      <div className="min-h-[100px] p-3 rounded-lg bg-background">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (!value.trim() && !showButtons) {
              setIsFocused(false)
            }
          }}
          placeholder={placeholder}
          className="w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-gray-400 text-sm"
        />
      </div>

      {showButtons && isFocused && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
          <button onClick={handleCancel} className="px-3 py-1.5 border border-input text-sm rounded-md hover:bg-muted">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
