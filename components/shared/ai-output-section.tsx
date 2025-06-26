"use client"

import * as React from "react"
import { 
  Sparkles, 
  Copy, 
  ChevronDown,
  ChevronUp,
  CheckIcon,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AIOutputSectionProps {
  title: string
  content: string | React.ReactNode
  type?: "email" | "data" | "calculation" | "summary"
  explanation?: string
  className?: string
}

/**
 * Unified AI Assistant Section that matches the drawer section UI patterns
 * Used for integrating AI output into the standard section layout
 */
export function AIAssistantSection({ 
  outputs = []
}: { 
  outputs?: Array<{
    title: string
    content: string | React.ReactNode
    type?: "email" | "data" | "calculation" | "summary"
    explanation?: string
  }>
}) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [expandedItems, setExpandedItems] = React.useState<Record<number, boolean>>({})
  const [copiedItems, setCopiedItems] = React.useState<Record<number, boolean>>({})

  const handleCopy = (index: number, content: string | React.ReactNode) => {
    const textContent = typeof content === 'string' 
      ? content 
      : (content as any)?.props?.children || ''
    
    navigator.clipboard.writeText(textContent)
    setCopiedItems(prev => ({ ...prev, [index]: true }))
    setTimeout(() => setCopiedItems(prev => ({ ...prev, [index]: false })), 2000)
  }

  const toggleItemExpanded = (index: number) => {
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }))
  }

  if (outputs.length === 0) return null

  return (
    <div className="rounded-lg border border-muted p-3 group">
      {/* Section Header - matches UnifiedDetailsPanel pattern */}
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" /> 
          )}
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="font-medium text-sm">AI Assistant</span>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isOpen && (
        <div className="mt-3 space-y-3">
          {outputs.map((output, index) => {
            const isExpanded = expandedItems[index] ?? true
            const isLongContent = typeof output.content === 'string' && output.content.length > 300

            return (
              <div key={index} className="space-y-2">
                {/* AI Explanation - Outside the card */}
                {output.explanation && (
                  <p className="ml-2 text-xs text-muted-foreground">
                    {output.explanation}
                  </p>
                )}

                {/* Content Card */}
                <Card className={cn(
                  "group ml-2 border-purple-200/50 bg-purple-50/30 dark:bg-purple-950/20",
                  "transition-all duration-200"
                )}>
                  <div className="p-4">
                    {/* Card Header with Title and Copy Button */}
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium">{output.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleCopy(index, output.content)}
                      >
                        {copiedItems[index] ? (
                          <>
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Content */}
                    <div className={cn(
                      "text-sm text-foreground/90",
                      !isExpanded && isLongContent && "max-h-32 overflow-hidden relative"
                    )}>
                      {output.content}
                      {!isExpanded && isLongContent && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-purple-50/30 dark:from-purple-950/20 to-transparent" />
                      )}
                    </div>

                    {/* Expand/Collapse button for long content */}
                    {isLongContent && (
                      <div className="mt-3 pt-3 border-t border-purple-200/30">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs w-full"
                          onClick={() => toggleItemExpanded(index)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Show more
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 