"use client"

import * as React from "react"
import { 
  Sparkles, 
  Copy, 
  Save, 
  MessageSquare, 
  Edit,
  ChevronDown,
  ChevronUp,
  CheckIcon,
  HelpCircle
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

export function AIOutputSection({ 
  title, 
  content, 
  type = "summary",
  explanation,
  className 
}: AIOutputSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [showExplanation, setShowExplanation] = React.useState(false)
  const [copiedToClipboard, setCopiedToClipboard] = React.useState(false)
  
  // Determine if content is long (more than 5 lines approximately)
  const isLongContent = typeof content === 'string' && content.length > 300

  const handleCopy = () => {
    const textContent = typeof content === 'string' 
      ? content 
      : (content as any)?.props?.children || ''
    
    navigator.clipboard.writeText(textContent)
    setCopiedToClipboard(true)
    setTimeout(() => setCopiedToClipboard(false), 2000)
  }

  const getTypeIcon = () => {
    switch(type) {
      case "email":
        return "✉️"
      case "data":
        return "📊"
      case "calculation":
        return "🧮"
      default:
        return "📝"
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <h4 className="text-sm font-medium">AI Assistant</h4>
          <span className="text-xs text-muted-foreground">• {title}</span>
          {explanation && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-purple-600 hover:text-purple-700 hover:underline ml-2"
            >
              What did AI do?
            </button>
          )}
        </div>
        {isLongContent && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Expand
              </>
            ) : (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Collapse
              </>
            )}
          </Button>
        )}
      </div>

      {/* Explanation (when expanded) */}
      {showExplanation && explanation && (
        <div className="px-3 py-2 bg-purple-50/50 dark:bg-purple-950/30 rounded-md border border-purple-200/30">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <HelpCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{explanation}</span>
          </p>
        </div>
      )}

      {/* Content Card */}
      <Card className={cn(
        "border-purple-200/50 bg-purple-50/30 dark:bg-purple-950/20",
        "transition-all duration-200",
        isCollapsed && "max-h-20 overflow-hidden"
      )}>
        <div className="p-4">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-lg">{getTypeIcon()}</span>
            <div className={cn(
              "flex-1 text-sm text-foreground/90",
              isCollapsed && "line-clamp-2"
            )}>
              {content}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-200/30">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleCopy}
            >
              {copiedToClipboard ? (
                <>
                  <CheckIcon className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
            >
              <Save className="h-3 w-3 mr-1" />
              Save to Notes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Add Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 