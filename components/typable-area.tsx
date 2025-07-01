"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

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
  const [isExpanded, setIsExpanded] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [shouldShowExpandButton, setShouldShowExpandButton] = React.useState(false)

  // Auto-resize textarea based on content
  React.useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto'
      
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 240 // Approximately 10 rows of text
      
      // Check if content exceeds max height
      setShouldShowExpandButton(scrollHeight > maxHeight)
      
      // Set height based on expanded state
      if (isExpanded || isFocused || scrollHeight <= maxHeight) {
        textareaRef.current.style.height = `${scrollHeight}px`
      } else {
        textareaRef.current.style.height = `${maxHeight}px`
      }
    }
  }, [value, isExpanded, isFocused])

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit(value)
      onChange("")
      setIsFocused(false)
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    onChange("")
    setIsFocused(false)
    setIsExpanded(false)
  }

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="relative">
          <div className="min-h-[100px] p-3 rounded-lg bg-background">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                if (!value.trim() && !showButtons) {
                  setIsFocused(false)
                }
              }}
              placeholder={placeholder}
              className={`w-full bg-transparent border-none outline-none resize-none placeholder:text-gray-400 text-sm ${
                !isExpanded && !isFocused && shouldShowExpandButton ? 'overflow-hidden' : 'overflow-hidden'
              }`}
              style={{ minHeight: '76px' }} // Approximately 3 lines of text
            />
            
            {/* Gradient overlay when truncated */}
            {!isExpanded && !isFocused && shouldShowExpandButton && (
              <div className="absolute bottom-3 left-3 right-3 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            )}
          </div>
        </div>
        
        {/* Show more/Show less button */}
        {shouldShowExpandButton && !isFocused && (
          <button
            onClick={handleToggleExpand}
            className="mt-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            {isExpanded ? (
              <>Show less <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>Show more <ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        )}
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
